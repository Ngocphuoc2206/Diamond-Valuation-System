using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Pricing.Application.Services;
using Pricing.Application.Services.Interfaces;
using Pricing.Infrastructure.Data;
using Pricing.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Controllers + minimal stuff
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// SwaggerGen (1 doc v1 để đơn giản; vẫn dùng ApiVersioning)
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Pricing.Api",
        Version = "v1",
        Description = "Pricing Service – effective price APIs"
    });
});

// Db + Repos + UoW
builder.Services.AddPricingInfrastructure(builder.Configuration);

// Application services
builder.Services.AddScoped<IPricingService, PricingService>();

// API Versioning + Explorer
builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ReportApiVersions = true;
})
.AddVersionedApiExplorer(setup =>
{
    setup.GroupNameFormat = "'v'VVV";       // => v1, v1.0
    setup.SubstituteApiVersionInUrl = true; // thay {version} ở route
});

// CORS để test trên Swagger UI/FE local
builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(p => p
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var AllowFE = "_allowFE";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(AllowFE, p => p
        .WithOrigins("http://localhost:5173") // Vite dev server
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

app.UseCors(AllowFE);

// Luôn bật Swagger
app.UseSwagger();
app.UseSwaggerUI(o =>
{
    // Một file swagger duy nhất v1
    o.SwaggerEndpoint("/swagger/v1/swagger.json", "Pricing.Api v1");
    o.RoutePrefix = string.Empty; // bật nếu muốn swagger ở "/"
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PricingDbContext>();
    try
    {
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Failed to apply migrations.");
    }
}

app.UseHttpsRedirection();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
