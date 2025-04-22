using backend.DTOs;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IChatbotService
    {
        Task<string> ProcessMessageAsync(ChatRequestDto request);
    }
}
