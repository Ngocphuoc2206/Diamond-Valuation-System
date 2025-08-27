using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Infrastructure.Data;
using Diamond.ValuationService.Infrastructure.Services;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1) Services cơ bản
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1.1 Đăng ký DI các service nghiệp vụ
builder.Services.AddScoped<IValuationService, ValuationServiceImpl>();
builder.Services.AddScoped<ICaseService, CaseService>();

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

        // ❌ Nếu không có class Seed thì bỏ dòng này
        // await Seed.SeedAsync(db);
    }
    catch (Exception ex) when (
        ex is SqlException sqlEx && sqlEx.Number == 1801 /* DB exists */ ||
        ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase))
    {
        Console.WriteLine("Database already exists. Skipping creation.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization failed: {ex.Message}");
    }
}

// 5) Middleware
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Docker")
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/error");
}

// Chỉ redirect HTTPS khi thực sự có endpoint HTTPS cấu hình qua ENV
var hasHttpsEndpoint = !string.IsNullOrWhiteSpace(
    Environment.GetEnvironmentVariable("Kestrel__Endpoints__Https__Url")
);
if (hasHttpsEndpoint)
{
    app.UseHttpsRedirection();
}

app.MapControllers();
app.Run();
