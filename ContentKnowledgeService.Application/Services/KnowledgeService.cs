using ContentKnowledgeService.Application.DTOs;
using ContentKnowledgeService.Application.Interfaces;
using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;

namespace ContentKnowledgeService.Application.Services;

public class KnowledgeService : IKnowledgeService
{
    private readonly IKnowledgeRepository _repo;

    public KnowledgeService(IKnowledgeRepository repo) => _repo = repo;

    public async Task<IEnumerable<KnowledgeResponse>> GetAllAsync()
        => (await _repo.GetAllAsync())
            .Select(k => new KnowledgeResponse
            {
                Id = k.Id,
                Title = k.Title,
                Summary = k.Summary,
                Content = k.Content,
                CategoryName = k.Category?.Name ?? "",
                CreatedAt = k.CreatedAt
            });

    public async Task<KnowledgeResponse?> GetByIdAsync(Guid id)
    {
        var k = await _repo.GetByIdAsync(id);
        if (k == null) return null;
        return new KnowledgeResponse
        {
            Id = k.Id,
            Title = k.Title,
            Summary = k.Summary,
            Content = k.Content,
            CategoryName = k.Category?.Name ?? "",
            CreatedAt = k.CreatedAt
        };
    }

    public async Task<KnowledgeResponse> CreateAsync(KnowledgeRequest req)
    {
        var entity = new Knowledge
        {
            Id = Guid.NewGuid(),
            Title = req.Title,
            Summary = req.Summary,
            Content = req.Content,
            CategoryId = req.CategoryId
        };

        // nếu truyền CategoryName mà không có CategoryId, tạo nhanh Category runtime (InMemory)
        if (entity.CategoryId == null && !string.IsNullOrWhiteSpace(req.CategoryName))
            entity.Category = new Category { Id = Guid.NewGuid(), Name = req.CategoryName! };

        await _repo.AddAsync(entity);

        return new KnowledgeResponse
        {
            Id = entity.Id,
            Title = entity.Title,
            Summary = entity.Summary,
            Content = entity.Content,
            CategoryName = entity.Category?.Name ?? "",
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<KnowledgeResponse?> UpdateAsync(Guid id, KnowledgeRequest req)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return null;

        entity.Title = req.Title;
        entity.Summary = req.Summary;
        entity.Content = req.Content;
        entity.CategoryId = req.CategoryId;
        if (entity.CategoryId == null && !string.IsNullOrWhiteSpace(req.CategoryName))
            entity.Category = new Category { Id = Guid.NewGuid(), Name = req.CategoryName! };

        await _repo.UpdateAsync(entity);

        return new KnowledgeResponse
        {
            Id = entity.Id,
            Title = entity.Title,
            Summary = entity.Summary,
            Content = entity.Content,
            CategoryName = entity.Category?.Name ?? "",
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return false;
        await _repo.DeleteAsync(entity);
        return true;
    }
}
