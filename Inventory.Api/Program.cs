
using Asp.Versioning;
using Inventory.Application.Services;
using Inventory.Domain.Repositories;
using Inventory.Infrastructure.Interfaces;
using Inventory.Infrastructure.Persistence;
using Inventory.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("InventoryConnection")));

builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IInventoryService, InventoryService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// SwaggerGen (1 doc v1 để đơn giản; vẫn dùng ApiVersioning)
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Inventory.Api",
        Version = "v1",
        Description = "Inventory Service – effective inventory APIs"
    });
});

// API Versioning + Explorer
builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ReportApiVersions = true;
})
.AddApiExplorer(setup =>
{
    setup.GroupNameFormat = "'v'VVV";       // => v1, v1.0
    setup.SubstituteApiVersionInUrl = true; // thay {version} ở route
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
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

app.UseSwagger();
app.UseSwaggerUI(o =>
{
    // Một file swagger duy nhất v1
    o.SwaggerEndpoint("/swagger/v1/swagger.json", "Pricing.Api v1");
    o.RoutePrefix = string.Empty; // bật nếu muốn swagger ở "/"
});


app.MapControllers();
app.Run();
