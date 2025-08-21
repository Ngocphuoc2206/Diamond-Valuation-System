using ContentKnowledgeService.Application.DTOs.Knowledge;

namespace ContentKnowledgeService.Application.Interfaces;

public interface IKnowledgeService
{
    Task<IEnumerable<KnowledgeDto>> GetAllAsync(CancellationToken ct = default);
    Task<KnowledgeDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<KnowledgeDto> CreateAsync(CreateKnowledgeDto dto, CancellationToken ct = default);
    Task<bool> UpdateAsync(UpdateKnowledgeDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
