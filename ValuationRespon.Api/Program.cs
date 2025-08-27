using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Application.Services;
using ValuationRespon.Infrastructure.Data;
using ValuationRespon.Infrastructure.Repositories;
using ValuationRespon.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ValuationResponDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// Register Repository + Service
builder.Services.AddScoped<IValuationCaseRepository, ValuationCaseRepository>();
builder.Services.AddScoped<IValuationCaseService, ValuationCaseService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Add Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger UI khi chạy dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Valuation Respon API v1");
        c.RoutePrefix = string.Empty; // mở swagger ngay root http://localhost:5000/
    });
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ValuationResponDbContext>();
    await db.Database.MigrateAsync();
}

app.MapControllers();
app.Run();
