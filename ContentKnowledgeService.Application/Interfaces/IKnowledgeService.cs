using ContentKnowledgeService.Application.DTOs;

namespace ContentKnowledgeService.Application.Interfaces;

public interface IKnowledgeService
{
    Task<IEnumerable<KnowledgeResponse>> GetAllAsync();
    Task<KnowledgeResponse?> GetByIdAsync(Guid id);
    Task<KnowledgeResponse> CreateAsync(KnowledgeRequest req);
    Task<KnowledgeResponse?> UpdateAsync(Guid id, KnowledgeRequest req);
    Task<bool> DeleteAsync(Guid id);
}
