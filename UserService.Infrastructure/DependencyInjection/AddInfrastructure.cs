using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UserService.Application.Interfaces;
using UserService.Domain.Interfaces;
using UserService.Infrastructure.Data;
using UserService.Infrastructure.Security;
using UserService.Infrastructure.UnitOfWork;

namespace UserService.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<UserDbContext>(opt =>
            opt.UseSqlServer(configuration.GetConnectionString("UserConnection")));

        services.AddScoped<IUnitOfWork, UOW>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        return services;
    }
}
