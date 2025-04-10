﻿using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RefreshTokenAsync(TokenRequest request);
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<User?> GetUserByEmailAsync(string email); // ✅ Add this
    }
}
