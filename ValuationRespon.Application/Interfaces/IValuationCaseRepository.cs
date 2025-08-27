using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Application.Interfaces
{
    public interface IValuationCaseRepository
    {
        Task<ValuationCase> AddCaseAsync(ValuationCase entity);
        Task<ValuationCase?> GetCaseAsync(Guid id);
        Task UpdateCaseAsync(ValuationCase entity);
        Task<ValuationTimeline> AddTimelineAsync(ValuationTimeline tl);
        Task<ValuationResult> AddResultAsync(ValuationResult result);
    }
}
