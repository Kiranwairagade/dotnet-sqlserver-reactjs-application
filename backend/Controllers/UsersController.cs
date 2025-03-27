using System.Threading.Tasks;
using ECommerceAPI.DTOs;
using ECommerceAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<UsersResponse>> GetUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null) // Make searchTerm nullable
        {
            // Check if user has permission to manage users
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "ManageUsers"))
            {
                return Forbid();
            }

            var response = await _userService.GetUsersAsync(pageNumber, pageSize, searchTerm);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDetailDto>> GetUserById(int id)
        {
            // Check if user has permission to manage users
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "ManageUsers"))
            {
                return Forbid();
            }

            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            // Check if user has permission to manage users
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "ManageUsers"))
            {
                return Forbid();
            }

            var success = await _userService.UpdateUserAsync(id, request);

            if (!success)
            {
                return NotFound(new { message = "User not found" });
            }

            return NoContent();
        }

        [HttpGet("roles")]
        public async Task<ActionResult> GetAllRoles()
        {
            // Check if user has permission to assign roles
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "AssignRoles"))
            {
                return Forbid();
            }

            var roles = await _userService.GetAllRolesAsync();
            return Ok(roles);
        }

        [HttpPost("roles/assign")]
        public async Task<ActionResult> AssignRole([FromBody] AssignRoleRequest request)
        {
            // Check if user has permission to assign roles
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "AssignRoles"))
            {
                return Forbid();
            }

            var success = await _userService.AssignRoleToUserAsync(request.UserId, request.RoleId);

            if (!success)
            {
                return BadRequest(new { message = "Failed to assign role" });
            }

            return NoContent();
        }

        [HttpPost("roles/remove")]
        public async Task<ActionResult> RemoveRole([FromBody] AssignRoleRequest request)
        {
            // Check if user has permission to assign roles
            if (!User.HasClaim(c => c.Type == "Permission" && c.Value == "AssignRoles"))
            {
                return Forbid();
            }

            var success = await _userService.RemoveRoleFromUserAsync(request.UserId, request.RoleId);

            if (!success)
            {
                return BadRequest(new { message = "Failed to remove role" });
            }

            return NoContent();
        }
    }
}