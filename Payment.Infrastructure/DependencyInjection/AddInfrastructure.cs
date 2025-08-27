using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Payment.Application.Services;
using Payment.Domain.Entities;
using Payment.Domain.Interfaces;
using Payment.Domain.Services.Interfaces;
using Payment.Infrastructure.Data;
using Payment.Infrastructure.UnitOfWork;
using SharedLibrary.Interfaces;
using SharedLibrary.Messaging;
using SharedLibrary.Messaging.Interfaces;
using SharedLibrary.Repository;
using System;

namespace Payment.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddPaymentInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<PaymentDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("PaymentConnection")));


        services.AddScoped<DbContext>(sp => sp.GetRequiredService<PaymentDbContext>());
        services.AddScoped<IGenericRepository<Payment.Domain.Entities.Payment>, GenericRepository<Payment.Domain.Entities.Payment>>();
        services.AddScoped<IGenericRepository<Refund>, GenericRepository<Refund>>();
        services.AddScoped<IGenericRepository<OutboxMessage>, GenericRepository<OutboxMessage>>();
        services.AddScoped<IUnitOfWork, Uow>();

        services.AddScoped<IPaymentService, PaymentService>();
        //services.AddSingleton<IEventBus, RabbitMQEventBus>();
        return services;
    }
}
