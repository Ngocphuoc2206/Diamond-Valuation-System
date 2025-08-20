using ContentKnowledgeService.Application.DTOs;
using ContentKnowledgeService.Application.Services;
using ContentKnowledgeService.Infrastructure.Data;
using ContentKnowledgeService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;

namespace ContentKnowledgeService.Tests;

public class ContentServiceTests
{
    [Fact]
    public async Task Create_And_GetById_Should_Work()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TestContentDb")
            .Options;

        using var db = new AppDbContext(opts);
        var repo = new ContentRepository(db);
        var svc  = new ContentService(repo);

        var created = await svc.CreateAsync(new CreateContentRequest { Title = "T", Body = "B" });
        var got = await svc.GetByIdAsync(created.Id);

        got.Should().NotBeNull();
        got!.Title.Should().Be("T");
    }
}
