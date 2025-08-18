using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.OpenApi.Models;
using System.IO;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

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

//Swagger 
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