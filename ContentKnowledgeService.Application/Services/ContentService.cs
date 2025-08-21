using ContentKnowledgeService.Application.Common;
using ContentKnowledgeService.Application.DTOs.Content;
using ContentKnowledgeService.Application.Interfaces;
using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;

namespace ContentKnowledgeService.Application.Services;

public class ContentService : IContentService
{
    private readonly IContentRepository _repo;
    public ContentService(IContentRepository repo) => _repo = repo;

    public async Task<ContentDto> CreateAsync(CreateContentDto dto, CancellationToken ct = default)
    {
        var entity = new Content
        {
            Title = dto.Title.Trim(),
            Body = dto.Body,
            Author = string.IsNullOrWhiteSpace(dto.Author) ? "system" : dto.Author.Trim(),
            Type = Enum.TryParse<ContentType>(dto.Type, true, out var t) ? t : ContentType.Blog,
            Slug = string.IsNullOrWhiteSpace(dto.Slug) ? dto.Title.Trim().ToLower().Replace(' ', '-') : dto.Slug.Trim().ToLower(),
            IsPublished = dto.IsPublished,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repo.AddAsync(entity, ct);
        return created.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
        => await _repo.DeleteAsync(id, ct);

    public async Task<IEnumerable<ContentDto>> GetAllAsync(CancellationToken ct = default)
        => (await _repo.GetAllAsync(ct)).Select(x => x.ToDto());

    public async Task<ContentDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<bool> UpdateAsync(UpdateContentDto dto, CancellationToken ct = default)
    {
        var existing = await _repo.GetByIdAsync(dto.Id, ct);
        if (existing is null) return false;
        existing.Title = dto.Title.Trim();
        existing.Body = dto.Body;
        existing.Author = string.IsNullOrWhiteSpace(dto.Author) ? "system" : dto.Author.Trim();
        existing.Type = Enum.TryParse<ContentType>(dto.Type, true, out var t) ? t : existing.Type;
        existing.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? existing.Slug : dto.Slug.Trim().ToLower();
        existing.IsPublished = dto.IsPublished;
        existing.UpdatedAt = DateTime.UtcNow;
        return await _repo.UpdateAsync(existing, ct);
    }
}
