using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Data;
using System.Security.Cryptography;
using System.Text;

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

        // 🔹 POST: Create User
        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Username = dto.Username,
                Email = dto.Email,
                IsActive = dto.IsActive,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Add permissions
            foreach (var perm in dto.UserPermissions)
            {
                _context.UserPermissions.Add(new UserPermission
                {
                    UserId = user.UserId,
                    ModuleName = perm.ModuleName,
                    CanCreate = perm.CanCreate,
                    CanRead = perm.CanRead,
                    CanUpdate = perm.CanUpdate,
                    CanDelete = perm.CanDelete
                });
            }

            await _context.SaveChangesAsync();

            return Ok(user);
        }

        // 🔹 GET: User by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return MapToDto(user);
        }

        // 🔹 GET: Users with pagination and search
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string searchTerm = "")
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u => u.Username.Contains(searchTerm) || u.Email.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = users.Select(MapToDto);

            var result = new
            {
                users = userDtos,
                pageNumber,
                pageSize,
                totalCount
            };

            return Ok(result);
        }

        // 🔹 PUT: Update User
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (user.Email != updateDto.Email && await _context.Users.AnyAsync(u => u.Email == updateDto.Email))
                return BadRequest(new { message = "Email already exists" });

            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.Email = updateDto.Email;
            user.IsActive = updateDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔹 DELETE: Delete User
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔹 PUT: Update User Permissions
        [HttpPut("{id}/permissions")]
        public async Task<IActionResult> UpdateUserPermissions(int id, [FromBody] List<string> permissions)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Permissions = permissions;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(MapToDto(user));
        }

        // 🔐 Helper to hash passwords
        // Update UserController's HashPassword method to use BCrypt like AuthService
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // 🔄 Helper to map User to DTO
        private UserDto MapToDto(User user)
        {
            return new UserDto(
                user.UserId,
                user.Username,
                user.Email,
                user.FirstName,
                user.LastName,
                user.IsActive,
                user.CreatedAt,
                user.UpdatedAt,
                user.Permissions
            );
        }
    }
}
