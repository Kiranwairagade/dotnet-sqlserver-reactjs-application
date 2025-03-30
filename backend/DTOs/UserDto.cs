using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    // User DTO used for API responses
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<string> Permissions { get; set; } = new List<string>();

        public UserDto() { }

        public UserDto(int userid, string username, string email, string firstName, string lastName, bool isActive, DateTime createdAt, DateTime updatedAt, List<string> permissions)
        {
            UserId = userid;
            Username = username;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            IsActive = isActive;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            Permissions = permissions;
        }
    }

    // Response object for user lists
    public class UsersResponse
    {
        public List<UserDetailDto> Users { get; set; } = new List<UserDetailDto>(); // Prevent null reference
        public int TotalCount { get; set; }
    }

    // Detailed User DTO
    public class UserDetailDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }

    // Update User Request DTO
    public class UpdateUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }

    // DTO for assigning roles
    public class AssignRoleRequest
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }

    // Role DTO
    public class RoleDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}
