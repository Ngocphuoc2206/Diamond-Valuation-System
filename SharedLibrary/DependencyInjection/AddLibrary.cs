using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using SharedLibrary.Jwt;
using Microsoft.IdentityModel.Tokens;
using SharedLibrary.ServiceClients;
using SharedLibrary.Messaging;
using RabbitMQ.Client;
using System.Net;
using System.Net.Http;
using System.Security.Authentication;

namespace SharedLibrary.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddSharedLibrary(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<JwtOptions>(config.GetSection("Jwt"));
            services.AddSingleton<IJwtService, JwtService>();

            var jwt = config.GetSection("Jwt").Get<JwtOptions>()!;
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(o =>
                {
                    o.TokenValidationParameters = new()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwt.Issuer,
                        ValidAudience = jwt.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SecretKey))
                    };
                });

            services.AddAuthorization();
            return services;
        }
    }
}
