using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Application.Services;
using ValuationRespon.Infrastructure.Data;
using ValuationRespon.Infrastructure.Repositories;
using ValuationRespon.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ====== DbContext ======
builder.Services.AddDbContext<ValuationResponDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// ====== DI: Repos + Services ======
builder.Services.AddScoped<IValuationCaseRepository, ValuationCaseRepository>();
builder.Services.AddScoped<IValuationCaseService, ValuationCaseService>();
builder.Services.AddScoped<IEmailService, EmailService>(); // hoặc FakeEmailService cho môi trường dev

// ====== Controllers + JSON ======
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        // Tránh lỗi vòng tham chiếu khi trả entity có navigation (Case -> Result/Timelines)
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        // Nếu muốn giữ nguyên tên property theo C#:
        // o.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// ====== Swagger ======
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ====== AutoMapper (nếu có Profile) ======
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// ====== CORS cho FE ======
var allowed = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
              ?? new[] { "http://localhost:5173", "http://localhost:3000" };

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("FE", p =>
        p.WithOrigins(allowed)
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials());
});

// ====== (Tuỳ chọn) JWT Auth ======
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(...);
// builder.Services.AddAuthorization();

var app = builder.Build();

// ====== Swagger UI ======
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Valuation Respon API v1");
        c.RoutePrefix = string.Empty; // mở swagger ngay root
    });
}

// ====== Migrate DB khi khởi động ======
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ValuationResponDbContext>();
    await db.Database.MigrateAsync();
}

// ====== Pipeline ======
app.UseCors("FE");
// app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// (tiện test health)
app.MapGet("/", () => Results.Ok(new { service = "ValuationRespon API", ok = true }));

app.Run();
