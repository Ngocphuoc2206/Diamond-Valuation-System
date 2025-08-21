using Microsoft.EntityFrameworkCore;
using Product.Application.Interfaces;
using Product.Application.Services;
using Product.Infrastructure.Data;
using Product.Infrastructure.Repositories;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Thêm swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Product API", Version = "v1" });
});

// Config
var conn = builder.Configuration.GetConnectionString("Default") ?? "Data Source=product.db";
builder.Services.AddDbContext<ProductDbContext>(o => o.UseSqlite(conn));

// DI
builder.Services.AddScoped<IDiamondRepository, DiamondRepository>();
builder.Services.AddScoped<IPriceSourceRepository, PriceSourceRepository>();
builder.Services.AddScoped<IEstimationService, EstimationService>();
builder.Services.AddScoped<ICatalogService, CatalogService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

// Ensure DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ProductDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Product API v1");
    });
}

app.UseAuthorization();

app.MapControllers();

app.Run();
