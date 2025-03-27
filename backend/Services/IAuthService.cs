using System.Threading.Tasks;
using ECommerceAPI.DTOs;

namespace ECommerceAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<UserDto> GetUserByIdAsync(int userId);
    }
}