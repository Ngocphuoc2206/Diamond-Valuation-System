using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.OpenApi.Models;
using SharedLibrary.DependencyInjection;
using System.IO;
using UserService.Application.Interfaces;
using UserService.Application.Services.Interfaces;
using UserService.Application.Services;
using UserService.Infrastructure.DependencyInjection;
using UserService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using UserService.Domain.Interfaces;
using UserService.Infrastructure.Seeding;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

//add services in Infra + SharedLibrary (JWT)
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSharedLibrary(builder.Configuration);

// Application services
builder.Services.AddScoped<IUserService, UserService.Application.Services.UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

//Apiversioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1,0);
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
//Add Controller
builder.Services.AddControllers();

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
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var AllowFE = "_allowFE";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(AllowFE, p => p
        .WithOrigins("http://localhost:5173") // Vite dev server
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});


var app = builder.Build();

app.UseCors(AllowFE);

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UserDbContext>();
    await db.Database.MigrateAsync();

    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
    // Kiểm tra và tạo dữ liệu mẫu nếu cần
    await DbSeeder.SeedAsync(db, hasher);
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
            $"User Service {description.GroupName.ToUpperInvariant()}");
    }
    options.RoutePrefix = string.Empty; // Đặt Swagger ở đường dẫn gốc
    // Mặc định mở v1
    options.DefaultModelsExpandDepth(-1);
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


//Pipeline
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();