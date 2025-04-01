using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using System.Data;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get users with pagination & search
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null)
        {
            var users = new List<UserDto>();
            int totalCount = 0;

            await using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "EXEC sp_GetUsers @PageNumber, @PageSize, @SearchTerm";
                command.CommandType = CommandType.Text;
                command.Parameters.Add(new SqlParameter("@PageNumber", pageNumber));
                command.Parameters.Add(new SqlParameter("@PageSize", pageSize));
                command.Parameters.Add(new SqlParameter("@SearchTerm", (object?)searchTerm ?? DBNull.Value));

                await _context.Database.OpenConnectionAsync();
                await using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        users.Add(new UserDto
                        {
                            UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                            Username = reader.GetString(reader.GetOrdinal("Username")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            FirstName = reader.IsDBNull(reader.GetOrdinal("FirstName")) ? string.Empty : reader.GetString(reader.GetOrdinal("FirstName")),
                            LastName = reader.IsDBNull(reader.GetOrdinal("LastName")) ? string.Empty : reader.GetString(reader.GetOrdinal("LastName")),
                            IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                            CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                            UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                        });
                        totalCount = reader.GetInt32(reader.GetOrdinal("TotalCount"));
                    }
                }
            }

            return Ok(new { users, totalCount, pageNumber, pageSize });
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return userDto;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto createUserDto)
        {
            // Check if username or email already exists
            if (await _context.Users.AnyAsync(u => u.Username == createUserDto.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            if (await _context.Users.AnyAsync(u => u.Email == createUserDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
                // Note: Password handling should be implemented with proper hashing
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, userDto);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Check if username is being changed and if it already exists
            if (updateUserDto.Username != user.Username &&
                await _context.Users.AnyAsync(u => u.Username == updateUserDto.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Check if email is being changed and if it already exists
            if (updateUserDto.Email != user.Email &&
                await _context.Users.AnyAsync(u => u.Email == updateUserDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.IsActive = updateUserDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PATCH: api/Users/5/activate
        [HttpPatch("{id}/activate")]
        public async Task<IActionResult> ActivateUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/Users/5/deactivate
        [HttpPatch("{id}/deactivate")]
        public async Task<IActionResult> DeactivateUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Users/5
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

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}