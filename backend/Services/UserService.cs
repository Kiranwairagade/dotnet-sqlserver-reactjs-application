using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IUserService
    {
        Task<UsersResponse> GetUsersAsync(int pageNumber, int pageSize, string? searchTerm);
        Task<UserDetailDto> GetUserByIdAsync(int id);
        Task<bool> UpdateUserAsync(int id, UpdateUserRequest request);
    }

    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UsersResponse> GetUsersAsync(int pageNumber, int pageSize, string? searchTerm)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(u => u.Username.Contains(searchTerm) || u.Email.Contains(searchTerm));
            }

            var users = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDetailDto
                {
                    Id = u.UserId,
                    Username = u.Username,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName
                })
                .ToListAsync();

            var totalCount = await query.CountAsync();

            return new UsersResponse
            {
                Users = users,
                TotalCount = totalCount
            };
        }

        public async Task<UserDetailDto> GetUserByIdAsync(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            return new UserDetailDto
            {
                Id = user.UserId,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        public async Task<bool> UpdateUserAsync(int id, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            user.Username = request.Username;
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
