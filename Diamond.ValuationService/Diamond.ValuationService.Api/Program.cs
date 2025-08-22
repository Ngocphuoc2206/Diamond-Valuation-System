using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Infrastructure.Data;
using Diamond.ValuationService.Infrastructure.Mapping;
using Diamond.ValuationService.Infrastructure.Service;
using Diamond.ValuationService.Infrastructure.Services;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1) Services cơ bản
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<IValuationService, ValuationServiceImpl>();
builder.Services.AddScoped<ICaseService, CaseService>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

// 2) Connection string (ưu tiên ENV cho Docker)
var sqlCs =
    Environment.GetEnvironmentVariable("ConnectionStrings__SqlServer")
    ?? builder.Configuration.GetConnectionString("SqlServer")
    ?? builder.Configuration["ConnectionStrings:SqlServer"];

// 3) DbContext: có CS ⇒ SQL Server; không có ⇒ InMemory
var useSqlServer = !string.IsNullOrWhiteSpace(sqlCs);
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (useSqlServer)
        options.UseSqlServer(sqlCs, sql => sql.EnableRetryOnFailure(3));
    else
        options.UseInMemoryDatabase("DiamondDb");
});

var app = builder.Build();

// 4) Auto-migrate & seed khi dùng SQL (bỏ qua lỗi DB đã tồn tại)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        if (useSqlServer)
        {
            Console.WriteLine("Applying SQL Server migrations...");
            db.Database.Migrate();
            Console.WriteLine("Migration completed.");
        }
        await Seed.SeedAsync(db);
    }
    catch (Exception ex) when (
        ex is SqlException sqlEx && sqlEx.Number == 1801 /* DB exists */ ||
        ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase))
    {
        // ignore
        Console.WriteLine("Database already exists. Skipping creation.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization failed: {ex.Message}");
    }
}

// 5) Middleware

// Hiện lỗi chi tiết trong Docker/Development để debug 500
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Docker")
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Production: handler gọn
    app.UseExceptionHandler("/error");
}

// Redirect HTTPS chỉ khi có endpoint HTTPS (container có cấu hình Kestrel HTTPS)
var hasHttpsEndpoint = !string.IsNullOrWhiteSpace(
    Environment.GetEnvironmentVariable("Kestrel__Endpoints__Https__Url")
);
if (app.Environment.IsDevelopment() || hasHttpsEndpoint)
{
    app.UseHttpsRedirection();
}

app.MapControllers();
app.Run();
