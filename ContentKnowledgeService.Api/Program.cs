using ContentKnowledgeService.Application.Interfaces;
using ContentKnowledgeService.Application.Services;
using ContentKnowledgeService.Domain.Interfaces;
using ContentKnowledgeService.Infrastructure.Data;
using ContentKnowledgeService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("ContentDb")); // Dùng InMemory cho test nhanh

builder.Services.AddScoped<IContentRepository, ContentRepository>();
builder.Services.AddScoped<IContentService, ContentService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
