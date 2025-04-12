using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IPermissionService
    {
        Task<List<UserPermission>> GetUserPermissionsAsync(int userId);
        Task<List<string>> GetUserPermissionNamesAsync(int userId);
        Task UpdateUserPermissionsAsync(int userId, List<UserPermission> permissions);
    }

    public class PermissionService : IPermissionService
    {
        private readonly ApplicationDbContext _context;

        public PermissionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserPermission>> GetUserPermissionsAsync(int userId)
        {
            return await _context.UserPermissions
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<string>> GetUserPermissionNamesAsync(int userId)
        {
            var permissions = await _context.UserPermissions
                .Where(p => p.UserId == userId)
                .ToListAsync();

            var permissionNames = new List<string>();

            foreach (var perm in permissions)
            {
                if (perm.CanRead) permissionNames.Add($"{perm.ModuleName}:read");
                if (perm.CanCreate) permissionNames.Add($"{perm.ModuleName}:create");
                if (perm.CanUpdate) permissionNames.Add($"{perm.ModuleName}:update");
                if (perm.CanDelete) permissionNames.Add($"{perm.ModuleName}:delete");
            }

            return permissionNames;
        }

        public async Task UpdateUserPermissionsAsync(int userId, List<UserPermission> permissions)
        {
            var existingPermissions = await _context.UserPermissions
                .Where(p => p.UserId == userId)
                .ToListAsync();

            _context.UserPermissions.RemoveRange(existingPermissions);

            foreach (var permission in permissions)
            {
                permission.UserId = userId;
                _context.UserPermissions.Add(permission);
            }

            await _context.SaveChangesAsync();
        }
    }
}
