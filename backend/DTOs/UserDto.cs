// DTOs/UserDtos.cs
using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public record UserDto(
        int UserId,
        string Username,
        string Email,
        string FirstName,
        string LastName,
        bool IsActive,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        List<string> Permissions
    );

    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<UserPermissionDto> UserPermissions { get; set; } = new List<UserPermissionDto>();

    }

    public class UpdateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class UsersResponse
    {
        public List<UserDetailDto> Users { get; set; } = new List<UserDetailDto>();
        public int TotalCount { get; set; }
    }

    public class UserDetailDto
    {
        public int UserId { get; set; }              // <-- changed from Id to UserId
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }

    public class UpdateUserRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
