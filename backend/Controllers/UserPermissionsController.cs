using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using backend.Models;
using backend.Data;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserPermissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserPermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 POST: Create or Update Permission
        [HttpPost]
        public async Task<IActionResult> SetPermission(CreateUserPermissionDto dto)
        {
            var existing = await _context.UserPermissions
                .FirstOrDefaultAsync(p => p.UserId == dto.UserId && p.ModuleName == dto.ModuleName);

            if (existing != null)
            {
                existing.CanCreate = dto.CanCreate;
                existing.CanRead = dto.CanRead;
                existing.CanUpdate = dto.CanUpdate;
                existing.CanDelete = dto.CanDelete;
            }
            else
            {
                var permission = new UserPermission
                {
                    UserId = dto.UserId,
                    ModuleName = dto.ModuleName,
                    CanCreate = dto.CanCreate,
                    CanRead = dto.CanRead,
                    CanUpdate = dto.CanUpdate,
                    CanDelete = dto.CanDelete
                };
                _context.UserPermissions.Add(permission);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Permissions saved." });
        }

        // 🔹 GET: Get User Permissions
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<UserPermission>>> GetUserPermissions(int userId)
        {
            var permissions = await _context.UserPermissions
                .Where(p => p.UserId == userId)
                .ToListAsync();

            return Ok(permissions);
        }

        // 🔹 DELETE: Remove Permission
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermission(int id)
        {
            var permission = await _context.UserPermissions.FindAsync(id);
            if (permission == null)
                return NotFound();

            _context.UserPermissions.Remove(permission);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Permission deleted." });
        }
    }
}
