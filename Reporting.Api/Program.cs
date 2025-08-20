using MediatR;
using Reporting.Application.Metrics.GetOverview;
using Reporting.Infrastructure.Configuration;
using Reporting.Infrastructure.Persistence;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();

// MediatR: quét assembly của Application
builder.Services.AddMediatR(typeof(GetOverviewHandler).Assembly);

// Hạ tầng: DbContext + repositories (lấy CS từ appsettings)
var conn = builder.Configuration.GetConnectionString("Default");
// nếu AddInfrastructure có overload nhận CS thì dùng như sau:
builder.Services.AddInfrastructure(conn);

  var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();   // tạo DB nếu chưa có
    DbSeeder.Seed(db);         // gọi seed data
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
