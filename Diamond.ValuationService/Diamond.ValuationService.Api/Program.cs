using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Infrastructure.Data;
using Diamond.ValuationService.Infrastructure.Mapping;
using Diamond.ValuationService.Infrastructure.Service;
using Diamond.ValuationService.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IPdfService, PdfService>();

// chọn DB theo môi trường
var sqlCs = builder.Configuration.GetConnectionString("SqlServer")
          ?? builder.Configuration["ConnectionStrings:SqlServer"]
          ?? builder.Configuration["DbConnection"];

if (builder.Environment.IsEnvironment("Docker") && !string.IsNullOrWhiteSpace(sqlCs))
{
    builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(sqlCs));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase("DiamondDb"));
}

builder.Services.AddScoped<IValuationService, ValuationServiceImpl>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// Auto-migrate khi dùng SQL Server trong Docker + seed dữ liệu mẫu
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (app.Environment.IsEnvironment("Docker"))
        db.Database.Migrate();            // tự tạo DB/tables nếu chưa có

    await Seed.SeedAsync(db);             // chỉ seed khi trống
}

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Docker"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
