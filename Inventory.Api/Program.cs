
using Inventory.Application.Services;
using Inventory.Domain.Repositories;
using Inventory.Infrastructure.Interfaces;
using Inventory.Infrastructure.Persistence;
using Inventory.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IInventoryService, InventoryService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto migrate khi chạy
var runMigration = builder.Configuration.GetValue<bool>("RunMigration");

if (runMigration)
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
        db.Database.Migrate();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Inventory API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.MapControllers();
app.Run();
