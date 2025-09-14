using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Order.Application.Interfaces;
using Order.Application.Services;
using Order.Application.Services.Interfaces;
using Order.Infrastructure.Data;
using Order.Infrastructure.DependencyInjection;
using Serilog;
using SharedLibrary.DependencyInjection;
using System.Text.Json.Serialization;

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// --- OpenAPI (tùy dùng) ---
builder.Services.AddOpenApi();

// Controllers + JSON
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opt.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// ===== JWT/Auth từ SharedLibrary (đảm bảo có section "Jwt") =====
builder.Services.AddSharedLibrary(builder.Configuration);

// ===== Db, UoW, Repos =====
builder.Services.AddOrderInfrastructure(builder.Configuration);
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<DbContext>(sp => sp.GetRequiredService<OrderDbContext>());

// ===== CORS =====
var AllowFE = "_allowFE";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(AllowFE, p => p
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

// ===== API Versioning + ApiExplorer (QUAN TRỌNG) =====
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";          // v1, v1.0, ...
    options.SubstituteApiVersionInUrl = true;    // dùng {version} trong route
});

// ===== SwaggerGen (tạo doc cho MỖI version) =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Bearer security
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập: Bearer {your JWT token}"
    };
    options.AddSecurityDefinition("Bearer", scheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { scheme, Array.Empty<string>() }
    });

    // Tạo SwaggerDoc theo version (cần provider tạm thời)
    using var sp = builder.Services.BuildServiceProvider();
    var apiProvider = sp.GetRequiredService<IApiVersionDescriptionProvider>();
    foreach (var desc in apiProvider.ApiVersionDescriptions)
    {
        options.SwaggerDoc(desc.GroupName, new OpenApiInfo
        {
            Title = "Order + Cart API",
            Version = desc.ApiVersion.ToString()
        });
    }

    // XML comments (nếu bật trong csproj)
    var xmlFile = $"{typeof(Program).Assembly.GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        options.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

app.UseCors(AllowFE);
app.UseSerilogRequestLogging();

// Migrate DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OrderDbContext>();
    db.Database.Migrate();
}

// Swagger UI theo version
app.UseSwagger();

var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
app.UseSwaggerUI(options =>
{
    foreach (var description in provider.ApiVersionDescriptions)
    {
        options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json",
            $"Order + Cart Service {description.GroupName.ToUpperInvariant()}");
    }
    options.RoutePrefix = string.Empty;           // Swagger ở "/"
    options.DefaultModelsExpandDepth(-1);
});

// (OpenAPI tự động của .NET Aspire/.NET 8 – tùy dùng)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
