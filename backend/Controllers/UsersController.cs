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

namespace backend.Controllers // ✅ Ensure this namespace is correctly defined
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase // ✅ Ensure the class is inside a namespace
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
                            UserId = reader.GetInt32(reader.GetOrdinal("UserId")),  // ✅ Fixed missing UserId
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
    }
}
