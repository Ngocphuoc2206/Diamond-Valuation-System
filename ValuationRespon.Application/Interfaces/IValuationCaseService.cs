using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Application.Interfaces
{
    public interface IValuationCaseService
    {
        Task<ValuationCase> CreateCaseAsync(ValuationCase request);
        Task<ValuationTimeline> AddTimelineAsync(Guid caseId, ValuationTimeline timeline);
        Task<ValuationResult> CompleteValuationAsync(Guid caseId, ValuationResult result);
    }
}
