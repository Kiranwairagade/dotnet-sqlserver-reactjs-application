using backend.DTOs;
using System.Threading.Tasks;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(TokenRequest request);
    Task<UserDto?> GetUserByIdAsync(int userId);
}
