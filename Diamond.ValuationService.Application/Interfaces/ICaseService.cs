using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Domain.Entities;

namespace Diamond.ValuationService.Application.Interfaces;

public interface ICaseService
{
    Task<CreateCaseResponseDto> CreateAsync(CreateCaseRequestDto dto, CancellationToken ct = default);
    Task<PagedResult<CaseListItemDto>> GetCasesForUserAsync(
        int? userId, int page, int pageSize, string? status, CancellationToken ct);

    Task<bool> AssignAsync(Guid id, int assigneeId, string? assigneeName, CancellationToken ct = default);
    Task<bool> AssignValuationAsync(Guid id, int assigneeId, string? assigneeName, CancellationToken ct = default);

    Task<CaseDetailDto?> GetCaseDetailForUserAsync(Guid id, int userId, CancellationToken ct);
    Task<bool> UpdateStatusAsync(Guid caseId, CaseStatus status, CancellationToken ct = default);

    Task UpdateResultAsync(Guid caseId, UpdateResultDto dto, CancellationToken ct);

}
