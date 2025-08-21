using ContentKnowledgeService.Application.Common;
using ContentKnowledgeService.Application.DTOs.Knowledge;
using ContentKnowledgeService.Application.Interfaces;
using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;

namespace ContentKnowledgeService.Application.Services;

public class KnowledgeService : IKnowledgeService
{
    private readonly IKnowledgeRepository _repo;
    public KnowledgeService(IKnowledgeRepository repo) => _repo = repo;

    public async Task<KnowledgeDto> CreateAsync(CreateKnowledgeDto dto, CancellationToken ct = default)
    {
        var entity = new Knowledge
        {
            Title = dto.Title.Trim(),
            Description = dto.Description,
            Tags = dto.Tags?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repo.AddAsync(entity, ct);
        return created.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
        => await _repo.DeleteAsync(id, ct);

    public async Task<IEnumerable<KnowledgeDto>> GetAllAsync(CancellationToken ct = default)
        => (await _repo.GetAllAsync(ct)).Select(x => x.ToDto());

    public async Task<KnowledgeDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<bool> UpdateAsync(UpdateKnowledgeDto dto, CancellationToken ct = default)
    {
        var existing = await _repo.GetByIdAsync(dto.Id, ct);
        if (existing is null) return false;
        existing.Title = dto.Title.Trim();
        existing.Description = dto.Description;
        existing.Tags = dto.Tags?.Trim() ?? string.Empty;
        existing.UpdatedAt = DateTime.UtcNow;
        return await _repo.UpdateAsync(existing, ct);
    }
}
