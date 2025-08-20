using SharedLibrary.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserService.Domain.Entities;

namespace UserService.Application.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<User> UserRepository { get; }
        IGenericRepository<Role> RoleRepository { get; }
        IGenericRepository<UserRole> UserRoleRepository { get; }
        IGenericRepository<RefreshToken> RefreshTokenRepository { get; }
        Task<int> SaveChangesAsync();
    }
}
