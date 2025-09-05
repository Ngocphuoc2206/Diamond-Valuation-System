using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Infrastructure.Data;
using Diamond.ValuationService.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------
// Controllers / Swagger
// ------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ------------------------------
// DI services nghiệp vụ
// ------------------------------
builder.Services.AddScoped<IValuationService, ValuationServiceImpl>();
builder.Services.AddScoped<ICaseService, CaseService>();

// ------------------------------
// Connection string
// Ưu tiên: appsettings.* -> ENV (ConnectionStrings__ValuationConnection) -> default docker
// ------------------------------
string GetConnectionString()
{
    return builder.Configuration.GetConnectionString("ValuationConnection")
           ?? Environment.GetEnvironmentVariable("ConnectionStrings__ValuationConnection")
           ?? "Server=sqlserver,1433;Database=DiamondValuationDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True";
}

var cs = GetConnectionString();

// ------------------------------
// DbContext (SQL Server)
// - Chỉ rõ MigrationsAssembly = Diamond.ValuationService.Infrastructure
// - Bật retry on failure
// ------------------------------
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(cs, sql =>
    {
        sql.MigrationsAssembly("Diamond.ValuationService.Infrastructure");
        sql.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
    });
});

// CORS cho FE
// ------------------------------
builder.Services.AddCors(o => o.AddPolicy("FE",
    p => p.WithOrigins("http://localhost:5173", "http://localhost:3000")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials()
));

// ------------------------------
// Build app
// ------------------------------
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Chỉ bật HTTPS redirection khi có cấu hình endpoint HTTPS
var hasHttpsEndpoint = !string.IsNullOrWhiteSpace(
    Environment.GetEnvironmentVariable("Kestrel__Endpoints__Https__Url")
);
if (hasHttpsEndpoint) app.UseHttpsRedirection();

app.UseCors("FE");

// ------------------------------
// Apply migrations khi khởi động
// ------------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        await db.Database.MigrateAsync();
        await PriceTableSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        // Ghi log lỗi migration, nhưng vẫn cho app chạy để đọc log container
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Database migration failed.");
        throw; // nếu muốn fail fast khi DB lỗi, giữ dòng này; nếu không, có thể comment.
    }
}

app.MapControllers();

await app.RunAsync();
