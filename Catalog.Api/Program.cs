using Catalog.Application.Interfaces;
using Catalog.Application.Services;
using Catalog.Infrastructure.Db;
using Catalog.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Catalog.Domain.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
// builder.Services.AddDbContext<CatalogDbContext>(opt =>
//     opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<CatalogDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        // sqlOptions => sqlOptions.MigrationsAssembly("Catalog.Infrastructure")
));


// Repositories
builder.Services.AddScoped<ProductRepository>();

// Services
builder.Services.AddScoped<IProductService, ProductService>();

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
