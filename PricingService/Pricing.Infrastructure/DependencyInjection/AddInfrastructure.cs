using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pricing.Application.Interfaces;
using Pricing.Domain.Entities;
using Pricing.Infrastructure.Data;
using Pricing.Infrastructure.UnitOfWork;
using SharedLibrary.Interfaces;
using SharedLibrary.Repository;

namespace Pricing.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddPricingInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<PricingDbContext>(opt =>
            opt.UseSqlServer(config.GetConnectionString("PricingConnection")));

        // nếu GenericRepository<T> yêu cầu DbContext base:
        services.AddScoped<DbContext>(sp => sp.GetRequiredService<PricingDbContext>());

        services.AddScoped<IGenericRepository<PriceList>, GenericRepository<PriceList>>();
        services.AddScoped<IGenericRepository<Price>, GenericRepository<Price>>();

        services.AddScoped<IUnitOfWork, Uow>();
        return services;
    }
}
