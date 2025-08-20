using SharedLibrary.Interfaces;
using SharedLibrary.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserService.Application.Interfaces;
using UserService.Domain.Entities;
using UserService.Domain.Interfaces;
using UserService.Infrastructure.Data;

namespace UserService.Infrastructure.UnitOfWork
{
    public class UOW : IUnitOfWork
    {
        private readonly UserDbContext _context;
        public UOW(UserDbContext context)
        {
            _context = context;
            UserRepository = new GenericRepository<User>(_context);
            RoleRepository = new GenericRepository<Role>(_context);
            UserRoleRepository = new GenericRepository<UserRole>(_context);
            RefreshTokenRepository = new GenericRepository<RefreshToken>(_context);
        }

        public IGenericRepository<User> UserRepository { get; }

        public IGenericRepository<Role> RoleRepository { get; }

        public IGenericRepository<UserRole> UserRoleRepository { get; }

        public IGenericRepository<RefreshToken> RefreshTokenRepository { get; }
        public Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            return _context.SaveChangesAsync(ct);
        }

        public Task<int> SaveChangesAsync()
        {
            throw new NotImplementedException();
        }
    }
}
