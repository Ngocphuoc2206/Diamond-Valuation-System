using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Order.Application.Services;
using Order.Application.Services.Interfaces;
using Order.Infrastructure.Data;
using Order.Infrastructure.DependencyInjection;
using SharedLibrary.DependencyInjection; // JWT ở SharedLibrary

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT/Auth từ SharedLibrary (đảm bảo đã config section "Jwt")
builder.Services.AddSharedLibrary(builder.Configuration);

// Db, UoW, Repos
builder.Services.AddOrderInfrastructure(builder.Configuration);

// Application services
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddScoped<DbContext>(sp => sp.GetRequiredService<OrderDbContext>());


//Apiversioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    // Cho phép đọc version qua URL segment
    options.ReportApiVersions = true;
})
    .AddApiExplorer(options =>
    {
        // Group name format cho Swagger: v1, v2
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

//Swagger + Bearer Authentication
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Auth API", Version = "v1" });
    var xmlFile = $"{typeof(Program).Assembly.GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Bearer security
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập Token theo dạng: Bearer {your JWT Token}"
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { scheme, new string[] { } }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Order.Infrastructure.Data.OrderDbContext>();
    db.Database.Migrate();
}

//Tạo swagger cho từng API version
var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    // Tạo một tab cho mỗi API version
    foreach (var description in provider.ApiVersionDescriptions)
    {
        options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json",
            $"Order + Cart Service {description.GroupName.ToUpperInvariant()}");
    }
    options.RoutePrefix = string.Empty; // Đặt Swagger ở đường dẫn gốc
    // Mặc định mở v1
    options.DefaultModelsExpandDepth(-1);
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
