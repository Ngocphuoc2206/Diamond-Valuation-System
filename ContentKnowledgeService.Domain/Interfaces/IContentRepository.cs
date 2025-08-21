using ContentKnowledgeService.Domain.Entities;

namespace ContentKnowledgeService.Domain.Interfaces;

public interface IContentRepository
{
    Task<IEnumerable<Content>> GetAllAsync(CancellationToken ct = default);
    Task<Content?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Content> AddAsync(Content entity, CancellationToken ct = default);
    Task<bool> UpdateAsync(Content entity, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
