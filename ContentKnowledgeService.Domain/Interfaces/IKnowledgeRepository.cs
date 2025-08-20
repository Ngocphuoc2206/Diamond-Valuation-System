using ContentKnowledgeService.Domain.Entities;

namespace ContentKnowledgeService.Domain.Interfaces;

public interface IKnowledgeRepository
{
    Task<IEnumerable<Knowledge>> GetAllAsync();
    Task<Knowledge?> GetByIdAsync(Guid id);
    Task AddAsync(Knowledge entity);
    Task UpdateAsync(Knowledge entity);
    Task DeleteAsync(Knowledge entity);
}
