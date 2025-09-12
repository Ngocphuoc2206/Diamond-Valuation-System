using System.Reflection;
using FluentValidation;
using FluentValidation.AspNetCore;
using InvoiceService.Application.Interfaces;
using InvoiceService.Application.Mapping;
using InvoiceService.Application.Services;
using InvoiceService.Application.Validation;
using InvoiceService.Domain.Interfaces;
using InvoiceService.Infrastructure.Data;
using InvoiceService.Infrastructure.Repositories;
using InvoiceService.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using SharedLibrary.Jwt;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<InvoiceDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// DI
builder.Services.AddScoped<IReceiptRepository, ReceiptRepository>();
builder.Services.AddScoped<IReceiptService, ReceiptService>();
builder.Services.AddScoped<IReceiptNumberGenerator, ReceiptNumberGenerator>();
builder.Services.AddSingleton<IJwtService, JwtService>(); // demo

// Validation + AutoMapper
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<CreateReceiptRequestValidator>();
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<InvoiceMappingProfile>());

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "InvoiceService API", Version = "v1" });
    var xml = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xml);
    if (File.Exists(xmlPath)) c.IncludeXmlComments(xmlPath, true);
});

builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("Default")!);

var app = builder.Build();

/* --- APPLY EF CORE MIGRATIONS AT STARTUP --- */
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<InvoiceDbContext>();
        // Tạo DB nếu chưa có & áp dụng mọi migration còn thiếu
        db.Database.Migrate();
        logger.LogInformation("Database migrated successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database migration failed.");
        // Tuỳ chọn: rethrow để container restart nếu DB chưa sẵn sàng
        // throw;
    }
}
/* ------------------------------------------- */

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.MapHealthChecks("/health");
app.MapControllers();

app.Run();
