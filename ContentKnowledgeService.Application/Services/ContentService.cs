using ContentKnowledgeService.Application.DTOs;
using ContentKnowledgeService.Application.Interfaces;
using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;

namespace ContentKnowledgeService.Application.Services;

public class ContentService : IContentService
{
    private readonly IContentRepository _repo;

    public ContentService(IContentRepository repo) => _repo = repo;

    public async Task<IEnumerable<ContentResponse>> GetAllAsync()
        => (await _repo.GetAllAsync())
            .Select(c => new ContentResponse
            {
                Id = c.Id,
                Title = c.Title,
                Body = c.Body,
                CategoryName = c.Category?.Name ?? "",
                CreatedAt = c.CreatedAt
            });

    public async Task<ContentResponse?> GetByIdAsync(Guid id)
    {
        var c = await _repo.GetByIdAsync(id);
        if (c == null) return null;
        return new ContentResponse
        {
            Id = c.Id,
            Title = c.Title,
            Body = c.Body,
            CategoryName = c.Category?.Name ?? "",
            CreatedAt = c.CreatedAt
        };
    }

    public async Task<ContentResponse> CreateAsync(CreateContentRequest req)
    {
        var entity = new Content
        {
            Id = Guid.NewGuid(),
            Title = req.Title,
            Body = req.Body,
            CategoryId = req.CategoryId
        };
        await _repo.AddAsync(entity);

        return new ContentResponse
        {
            Id = entity.Id,
            Title = entity.Title,
            Body = entity.Body,
            CategoryName = entity.Category?.Name ?? "",
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<ContentResponse?> UpdateAsync(Guid id, UpdateContentRequest req)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return null;

        entity.Title = req.Title;
        entity.Body = req.Body;
        entity.CategoryId = req.CategoryId;

        await _repo.UpdateAsync(entity);

        return new ContentResponse
        {
            Id = entity.Id,
            Title = entity.Title,
            Body = entity.Body,
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
