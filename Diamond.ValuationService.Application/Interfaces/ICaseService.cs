using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Domain.Entities;

namespace Diamond.ValuationService.Application.Interfaces;

public interface ICaseService
{
    Task<CreateCaseResponseDto> CreateAsync(CreateCaseRequestDto dto, CancellationToken ct = default);
    Task<bool> UpdateStatusAsync(Guid caseId, CaseStatus status, CancellationToken ct = default);
}
