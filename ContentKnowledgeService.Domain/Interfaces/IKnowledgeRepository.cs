using ContentKnowledgeService.Domain.Entities;

namespace ContentKnowledgeService.Domain.Interfaces;

public interface IKnowledgeRepository
{
    Task<IEnumerable<Knowledge>> GetAllAsync(CancellationToken ct = default);
    Task<Knowledge?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Knowledge> AddAsync(Knowledge entity, CancellationToken ct = default);
    Task<bool> UpdateAsync(Knowledge entity, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
