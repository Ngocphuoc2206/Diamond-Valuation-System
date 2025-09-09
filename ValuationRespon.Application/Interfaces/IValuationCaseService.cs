using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Application.Interfaces
{
    public interface IValuationCaseService
    {
        // Tạo case
        Task<ValuationCase> CreateCaseAsync(ValuationCase request, CancellationToken ct = default);

        // Lấy 1 case theo Id
        Task<ValuationCase?> GetCaseAsync(Guid id, CancellationToken ct = default);

        // Danh sách phân trang + lọc trạng thái
        Task<(int total, IEnumerable<object> items)> GetAllAsync(int page, int pageSize, string? status, CancellationToken ct = default);

        // Timeline
        Task<ValuationTimeline> AddTimelineAsync(Guid caseId, ValuationTimeline timeline, CancellationToken ct = default);
        Task<IReadOnlyList<ValuationTimeline>> GetTimelineAsync(Guid caseId, CancellationToken ct = default);

        // Result
        Task<ValuationResult> CompleteValuationAsync(Guid caseId, ValuationResult result, CancellationToken ct = default);
        Task<ValuationResult?> GetResultAsync(Guid caseId, CancellationToken ct = default);

        // (Tuỳ chọn) Assignee & Status – nếu bạn đang dùng trong Controller
        Task<bool> AssignAsync(Guid caseId, Guid assigneeId, string? assigneeName, CancellationToken ct = default);
        Task<bool> UpdateStatusAsync(Guid caseId, string status, CancellationToken ct = default);
    }
}
