using ContentKnowledgeService.Application.DTOs;

namespace ContentKnowledgeService.Application.Interfaces
{
    public interface IContentService
    {
        Task<ContentResponse> CreateContentAsync(CreateContentRequest request);
        Task<IEnumerable<ContentResponse>> GetAllAsync();
        Task<ContentResponse?> GetByIdAsync(Guid id);
        Task<ContentResponse?> UpdateContentAsync(UpdateContentRequest request);
        Task<bool> DeleteContentAsync(Guid id);
    }
}
