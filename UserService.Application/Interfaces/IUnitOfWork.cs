using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserService.Domain.Entities;

namespace UserService.Application.Interfaces
{
    public interface IUnitOfWork: IDisposable
    {
        IUserRepository UserRepository { get; }
        IRoleRepository RoleRepository { get; }
        Task<int> SaveChangesAsync();
    }
}
