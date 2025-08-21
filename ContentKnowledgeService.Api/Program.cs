using System.Text;
using ContentKnowledgeService.Application.Interfaces;
using ContentKnowledgeService.Application.Services;
using ContentKnowledgeService.Infrastructure.Extensions;
using ContentKnowledgeService.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Swagger (with JWT support)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Content & Knowledge Service", Version = "v1" });
    var securitySchema = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter JWT Bearer token **_only_**",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    };
    c.AddSecurityDefinition("Bearer", securitySchema);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securitySchema, new[] { "Bearer" } }
    });
});

// DbContext: Use SQL Server if ConnectionStrings:Default exists & non-empty, else InMemory
var connStr = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    if (!string.IsNullOrWhiteSpace(connStr))
        opt.UseSqlServer(connStr);
    else
        opt.UseInMemoryDatabase("ContentKnowledgeDb");
});

// JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection.GetValue<string>("Key") ?? "CHANGE_ME";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection.GetValue<string>("Issuer"),
        ValidAudience = jwtSection.GetValue<string>("Audience"),
        IssuerSigningKey = key,
        ValidateLifetime = true
    };
});

// Repositories (Infrastructure)
builder.Services.AddInfrastructure();
// Services (Application)
builder.Services.AddScoped<IContentService, ContentService>();
builder.Services.AddScoped<IKnowledgeService, KnowledgeService>();

builder.Services.AddControllers();

var app = builder.Build();

// Auto-migrate when using SQL Server
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        if (db.Database.IsSqlServer())
            db.Database.Migrate();
        if (!db.Contents.Any())
        {
            db.Contents.AddRange(new[] {
                new ContentKnowledgeService.Domain.Entities.Content { Title = "Giới thiệu công ty", Body = "Diamond Valuation System - Dịch vụ định giá kim cương.", Author = "admin", Slug="gioi-thieu", Type=ContentKnowledgeService.Domain.Entities.ContentType.Guide },
                new ContentKnowledgeService.Domain.Entities.Content { Title = "Blog: 4C của kim cương", Body = "Carat, Cut, Color, Clarity.", Author = "consultant", Slug="blog-4c", Type=ContentKnowledgeService.Domain.Entities.ContentType.Blog }
            });
            db.Knowledges.Add(new ContentKnowledgeService.Domain.Entities.Knowledge { Title = "Thang màu sắc GIA", Description = "Bảng màu D-Z theo GIA", Tags = "GIA,color" });
            await db.SaveChangesAsync();
        }
    }
    catch { /* ignore */ }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
