using ContentKnowledgeService.Application.DTOs;
using ContentKnowledgeService.Application.Services;
using ContentKnowledgeService.Infrastructure.Data;
using ContentKnowledgeService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;

namespace ContentKnowledgeService.Tests;

public class KnowledgeServiceTests
{
    [Fact]
    public async Task Create_And_List_Should_Work()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TestKnowledgeDb")
            .Options;

        using var db = new AppDbContext(opts);
        var repo = new KnowledgeRepository(db);
        var svc  = new KnowledgeService(repo);

        await svc.CreateAsync(new KnowledgeRequest { Title = "Tip 1", Summary = "S", Content = "C", CategoryName = "ValuationGuide" });

        var list = await svc.GetAllAsync();
        list.Should().ContainSingle(x => x.Title == "Tip 1" && x.CategoryName == "ValuationGuide");
    }
}
    