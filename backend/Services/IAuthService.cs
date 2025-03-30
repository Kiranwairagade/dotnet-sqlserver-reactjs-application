using System.Threading.Tasks;
using backend.DTOs;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<AuthResponse?> RefreshTokenAsync(TokenRequest request);
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<bool> ValidateTokenAsync(string token);
    }
}
