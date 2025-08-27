using Asp.Versioning;
using Asp.Versioning.ApiExplorer;   // cần cho IApiVersionDescriptionProvider
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Payment.Infrastructure.Data;
using Payment.Infrastructure.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddPaymentInfrastructure(builder.Configuration);

builder.Services.AddApiVersioning(opt =>
{
    opt.DefaultApiVersion = new ApiVersion(1, 0);
    opt.AssumeDefaultVersionWhenUnspecified = true;
    opt.ReportApiVersions = true;
})
.AddApiExplorer(setup =>
{
    setup.GroupNameFormat = "'v'VVV";
    setup.SubstituteApiVersionInUrl = true;
});

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
    var db = scope.ServiceProvider.GetRequiredService<PaymentDbContext>();
    db.Database.Migrate();

    // Đăng ký các event handler
    //var bus = scope.ServiceProvider.GetRequiredService<IEventBus>();
    //bus.Subscribe<OrderCreatedEvent, OrderCreatedEventHandler>();
}

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

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
