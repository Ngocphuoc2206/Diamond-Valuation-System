using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Order.Application.Interfaces;
using Order.Infrastructure.Data;
using Order.Infrastructure.UnitOfWork;
using SharedLibrary.Interfaces;
using SharedLibrary.Repository;
using Order.Domain.Entities;

namespace Order.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddOrderInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<OrderDbContext>(opt =>
            opt.UseSqlServer(config.GetConnectionString("OrderConnection")));

        services.AddScoped<IGenericRepository<Cart>, GenericRepository<Cart>>();
        services.AddScoped<IGenericRepository<CartItem>, GenericRepository<CartItem>>();
        services.AddScoped<IGenericRepository<Order.Domain.Entities.Order>, GenericRepository<Order.Domain.Entities.Order>>();
        services.AddScoped<IGenericRepository<OrderItem>, GenericRepository<OrderItem>>();

        services.AddScoped<IUnitOfWork, Uow>();
        return services;
    }
}
