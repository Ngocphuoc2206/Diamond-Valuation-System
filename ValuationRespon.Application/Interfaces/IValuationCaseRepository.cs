using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Application.Interfaces
{
    public interface IValuationCaseRepository
    {
        // CASE
        Task<ValuationCase> AddCaseAsync(ValuationCase entity, CancellationToken ct = default);
        IQueryable<ValuationCase> CasesAsQueryable(); // EF-backed
        Task<ValuationCase?> GetCaseAsync(Guid id, CancellationToken ct = default);
        Task<ValuationCase> UpdateCaseAsync(ValuationCase entity, CancellationToken ct = default);

        // TIMELINE
        Task<IReadOnlyList<ValuationTimeline>> GetTimelinesByCaseAsync(Guid caseId, CancellationToken ct = default);
        Task<ValuationTimeline> AddTimelineAsync(ValuationTimeline entity, CancellationToken ct = default);

        // RESULT
        Task<ValuationResult?> GetResultByCaseAsync(Guid caseId, CancellationToken ct = default);
        Task<ValuationResult> AddResultAsync(ValuationResult entity, CancellationToken ct = default);
        Task<ValuationResult> UpdateResultAsync(ValuationResult entity, CancellationToken ct = default);
    }

}
