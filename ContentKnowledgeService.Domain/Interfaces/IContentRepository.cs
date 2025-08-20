using ContentKnowledgeService.Domain.Entities;

namespace ContentKnowledgeService.Domain.Interfaces;

public interface IContentRepository
{
    Task<IEnumerable<Content>> GetAllAsync();
    Task<Content?> GetByIdAsync(Guid id);
    Task AddAsync(Content entity);
    Task UpdateAsync(Content entity);
    Task DeleteAsync(Content entity);
}
