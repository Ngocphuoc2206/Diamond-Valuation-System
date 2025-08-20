using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Reporting.Application.Abstractions;
using Reporting.Application.Interfaces;
using Reporting.Application.Metrics.GetOverview;
using Reporting.Infrastructure.Persistence;

namespace Reporting.Infrastructure.Configuration;

public static class InfrastructureModule
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string? connectionString = null)
    {
        services.AddDbContext<AppDbContext>(opt =>
            opt.UseSqlServer(connectionString ?? "Server=reportingdb,1433;Database=Reporting;User Id=sa;Password=Your_password123;TrustServerCertificate=true"));
        services.AddScoped<IReportingReadDb, SqlReportingReadDb>();
        return services;
    }
}
