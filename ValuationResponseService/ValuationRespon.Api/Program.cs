using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SharedLibrary.DependencyInjection;
using System.Buffers.Text;
using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Infrastructure.Data;
using ValuationRespon.Infrastructure.Services;
using ValuationRespon.Infrastructure.Settings;

var builder = WebApplication.CreateBuilder(args);

// ====== DbContext ======
builder.Services.AddDbContext<ValuationResponDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ValuationResponseConnection")));
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<ValuationRespon.Infrastructure.Http.AuthHeaderHandler>();
// ====== DI: Repos + Services ======
//builder.Services.AddScoped<IValuationCaseRepository, ValuationCaseRepository>();
//builder.Services.AddScoped<IValuationCaseService, ValuationCaseService>();
//builder.Services.AddScoped<IValuationEngine, ValuationEngine>();
builder.Services
    .AddOptions<SmtpSettings>()
    .Bind(builder.Configuration.GetSection("Smtp"))
    .ValidateDataAnnotations()
    .Validate(s => !string.IsNullOrWhiteSpace(s.Host), "Smtp:Host is required")
    .Validate(s => s.Port > 0, "Smtp:Port must be > 0")
    .ValidateOnStart();

builder.Services.AddScoped<IEmailService, SmtpEmailSender>(); // hoặc FakeEmailService cho môi trường dev

builder.Services.AddHttpClient<ICaseQueryClient, CaseQueryClient>((sp, c) =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();
    var baseUrl = cfg["Endpoints:ValuationRequest"] ?? "http://valuation-request-api:8080";
    c.BaseAddress = new Uri(baseUrl);
})
.AddHttpMessageHandler<ValuationRespon.Infrastructure.Http.AuthHeaderHandler>();

builder.Services.AddHttpClient<ICaseStatusClient, CaseStatusClient>((sp, c) =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();
    var baseUrl = cfg["Endpoints:ValuationRequest"] ?? "http://valuation-request-api:8080";
    c.BaseAddress = new Uri(baseUrl);
})
.AddHttpMessageHandler<ValuationRespon.Infrastructure.Http.AuthHeaderHandler>();

// ====== Controllers + JSON ======
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// ====== Swagger ======
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// JWT/Auth từ SharedLibrary (đảm bảo đã config section "Jwt")
builder.Services.AddSharedLibrary(builder.Configuration);


//Swagger + Bearer Authentication
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Valuation Response API", Version = "v1" });

    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập: Bearer {your JWT token}"
    };
    c.AddSecurityDefinition("Bearer", scheme);

    // Áp dụng scheme cho tất cả operation → Swagger UI tự gửi header
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { scheme, Array.Empty<string>() }
    });
});

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
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// (tiện test health)
app.MapGet("/", () => Results.Ok(new { service = "ValuationResponse API", ok = true }));

app.Run();
