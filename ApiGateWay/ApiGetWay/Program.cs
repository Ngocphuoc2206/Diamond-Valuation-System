using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ===== YARP: proxy từ appsettings.json =====
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// ===== Controllers =====
builder.Services.AddControllers();

// ===== CORS cho FE =====
var allowed = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
              ?? new[] { "http://localhost:5173", "http://localhost:3000" };

builder.Services.AddCors(o => o.AddPolicy("AllowFE", p =>
    p.WithOrigins(allowed)
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()
));

// ===== Health checks =====
builder.Services.AddHealthChecks();

// ===== JWT Authentication =====
// LƯU Ý: key/issuer/audience phải TRÙNG với nơi phát hành token (UserService)
var jwtKey = builder.Configuration["Jwt:SecretKey"] ?? builder.Configuration["Jwt:Key"] ?? "Dev_Key_ChangeMe";
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.RequireHttpsMetadata = false;
        opt.SaveToken = true;
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            // DEV: bật/tắt tuỳ môi trường & token của bạn
            ValidateIssuer = !string.IsNullOrWhiteSpace(jwtIssuer),
            ValidIssuer = jwtIssuer,

            ValidateAudience = !string.IsNullOrWhiteSpace(jwtAudience),
            ValidAudience = jwtAudience,

            ClockSkew = TimeSpan.Zero,

            RoleClaimType = "role",
            NameClaimType = ClaimTypes.NameIdentifier
        };

        opt.Events = new JwtBearerEvents
        {
            OnTokenValidated = ctx =>
            {
                if (ctx.Principal?.Identity is ClaimsIdentity id)
                {
                    foreach (var r in id.FindAll("roles"))
                        id.AddClaim(new Claim(ClaimTypes.Role, r.Value));
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// ===== Proxy phía trước/compose/nginx =====
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// ===== CORS =====
app.UseCors("AllowFE");
app.UseAuthentication();
app.UseAuthorization();

// ===== Endpoints =====
app.MapGet("/", () => Results.Ok(new { service = "ApiGateway", ok = true }));
app.MapHealthChecks("/healthz");

// Controller endpoints
app.MapControllers();

// YARP proxy endpoints
app.MapReverseProxy();

app.Run();
