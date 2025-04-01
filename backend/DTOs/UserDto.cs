using System;
using System.Collections.Generic;
namespace backend.DTOs
{
    // Existing UserDto
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<string> Roles { get; set; }

        // Default constructor for serialization
        public UserDto()
        {
            Roles = new List<string>();
        }

        // Constructor that matches the one being used in AuthService.cs
        public UserDto(int userId, string email, string firstName, string lastName,
                       string passwordHash, bool isActive, DateTime createdAt,
                       DateTime updatedAt, List<string> roles)
        {
            UserId = userId;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            // Note: passwordHash is not stored in the DTO for security
            IsActive = isActive;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            Roles = roles ?? new List<string>();
            // Username might be set to email or other value depending on your system
            Username = email; // Default to email if username isn't provided
        }
    }

    // The rest of your DTOs remain unchanged
    // DTO for creating users
    public class CreateUserDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Password { get; set; } = null!; // Include password for new users
    }
    // DTO for updating users
    public class UpdateUserDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public bool IsActive { get; set; }
    }
    // Response DTO for paginated user list
    public class UsersResponse
    {
        public List<UserDetailDto> Users { get; set; } = null!;
        public int TotalCount { get; set; }
    }
    // Detailed user DTO including roles
    public class UserDetailDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public List<string> Roles { get; set; } = new List<string>();
    }
    // Request DTO for updating users with UserService
    public class UpdateUserRequest
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
    }
    // DTO for roles
    public class RoleDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = null!;
    }
}