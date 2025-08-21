using ContentKnowledgeService.Application.DTOs.Content;

namespace ContentKnowledgeService.Application.Interfaces;

public interface IContentService
{
    Task<IEnumerable<ContentDto>> GetAllAsync(CancellationToken ct = default);
    Task<ContentDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ContentDto> CreateAsync(CreateContentDto dto, CancellationToken ct = default);
    Task<bool> UpdateAsync(UpdateContentDto dto, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
}
