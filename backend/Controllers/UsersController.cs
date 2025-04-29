using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using backend.Models;
using backend.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<UsersResponse>> GetUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(u =>
                    u.Username.ToLower().Contains(searchTerm) ||
                    u.Email.ToLower().Contains(searchTerm) ||
                    u.FirstName.ToLower().Contains(searchTerm) ||
                    u.LastName.ToLower().Contains(searchTerm)
                );
            }

            var totalCount = await query.CountAsync();

            var users = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDetailDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName
                })
                .ToListAsync();

            return Ok(new UsersResponse
            {
                Users = users,
                TotalCount = totalCount
            });
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.UserId == id)
                .Select(u => new UserDto(
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.IsActive,
                    u.CreatedAt,
                    u.UpdatedAt,
                    u.Permissions ?? new List<string>()
                ))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/users/5/permissions
        [HttpGet("{id}/permissions")]
        public async Task<ActionResult<IEnumerable<UserPermissionDto>>> GetUserPermissions(int id)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == id);
            if (!userExists)
            {
                return NotFound();
            }

            var permissions = await _context.UserPermissions
                .Where(p => p.UserId == id)
                .Select(p => new UserPermissionDto
                {
                    UserId = p.UserId,
                    ModuleName = p.ModuleName,
                    CanCreate = p.CanCreate,
                    CanRead = p.CanRead,
                    CanUpdate = p.CanUpdate,
                    CanDelete = p.CanDelete
                })
                .ToListAsync();

            return Ok(permissions);
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(CreateUserDto createUserDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == createUserDto.Username))
                return BadRequest(new { message = "Username already exists" });

            if (await _context.Users.AnyAsync(u => u.Email == createUserDto.Email))
                return BadRequest(new { message = "Email already exists" });

            // Hash password using BCrypt
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password);

            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                PasswordHash = hashedPassword,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                IsActive = createUserDto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Permissions = new List<string>()
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (createUserDto.UserPermissions != null && createUserDto.UserPermissions.Count > 0)
            {
                foreach (var perm in createUserDto.UserPermissions)
                {
                    var permission = new UserPermission
                    {
                        UserId = user.UserId,
                        ModuleName = perm.ModuleName,
                        CanCreate = perm.CanCreate,
                        CanRead = perm.CanRead,
                        CanUpdate = perm.CanUpdate,
                        CanDelete = perm.CanDelete
                    };
                    _context.UserPermissions.Add(permission);
                }

                await _context.SaveChangesAsync();

                user.Permissions = createUserDto.UserPermissions
                    .Where(p => p.CanRead || p.CanCreate || p.CanUpdate || p.CanDelete)
                    .Select(p => p.ModuleName)
                    .Distinct()
                    .ToList();

                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId },
                new UserDto(
                    user.UserId,
                    user.Username,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.IsActive,
                    user.CreatedAt,
                    user.UpdatedAt,
                    user.Permissions ?? new List<string>()
                ));
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            // Check for duplicate username
            if (user.Username != updateUserDto.Username &&
                await _context.Users.AnyAsync(u => u.Username == updateUserDto.Username))
                return BadRequest(new { message = "Username already exists" });

            // Check for duplicate email
            if (user.Email != updateUserDto.Email &&
                await _context.Users.AnyAsync(u => u.Email == updateUserDto.Email))
                return BadRequest(new { message = "Email already exists" });

            // Update user properties
            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.IsActive = updateUserDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            // Update permissions
            if (updateUserDto.UserPermissions != null)
            {
                // Remove existing permissions
                var existingPermissions = await _context.UserPermissions
                    .Where(p => p.UserId == id)
                    .ToListAsync();

                _context.UserPermissions.RemoveRange(existingPermissions);
                await _context.SaveChangesAsync();

                // Add new permissions
                foreach (var perm in updateUserDto.UserPermissions)
                {
                    var permission = new UserPermission
                    {
                        UserId = id,
                        ModuleName = perm.ModuleName,
                        CanCreate = perm.CanCreate,
                        CanRead = perm.CanRead,
                        CanUpdate = perm.CanUpdate,
                        CanDelete = perm.CanDelete
                    };
                    _context.UserPermissions.Add(permission);
                }

                // Update permissions list in user object
                user.Permissions = updateUserDto.UserPermissions
                    .Where(p => p.CanRead || p.CanCreate || p.CanUpdate || p.CanDelete)
                    .Select(p => p.ModuleName)
                    .Distinct()
                    .ToList();
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}