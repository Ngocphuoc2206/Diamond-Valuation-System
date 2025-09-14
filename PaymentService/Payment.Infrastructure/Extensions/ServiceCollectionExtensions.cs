using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Payment.Domain.Services;
using Payment.Domain.Settings;
using Payment.Infrastructure.Data;
using Payment.Infrastructure.Providers;
using SharedLibrary.Interfaces;
using SharedLibrary.Repository; // nếu có Repository riêng

namespace Payment.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddPaymentInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            // Bind section Payment: { ... } vào PaymentSettings
            services.Configure<PaymentSettings>(config.GetSection("Payment"));

            // Chỉ dùng SQL Server (không còn Sqlite fallback)
            var cs = config.GetConnectionString("PaymentDb")
                     ?? throw new InvalidOperationException("Connection string 'PaymentDb' not found");

            services.AddDbContext<PaymentDbContext>(options =>
            {
                options.UseSqlServer(cs, sql =>
                {
                    // tùy chọn: bật retry khi lỗi kết nối
                    sql.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorNumbersToAdd: null
                    );
                });
            });

            // đăng ký repository generic
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));


            // Đăng ký Provider FAKE (có thể thay bằng VNPay, Momo…)
            var baseUrl = config.GetSection("Payment")["PublicBaseUrl"]
                          ?? config.GetSection("Payment")["BaseUrl"]
                          ?? "http://localhost:9001";

            services.AddSingleton<IProvider, FakePaymentProvider>();

            return services;
        }
    }
}
