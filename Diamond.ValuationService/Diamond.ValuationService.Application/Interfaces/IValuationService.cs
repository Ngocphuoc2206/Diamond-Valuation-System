using Diamond.ValuationService.Application.DTOs;

namespace Diamond.ValuationService.Application.Interfaces;

public interface IValuationService
{
    Task<EstimateResponseDto> EstimateAsync(EstimateRequestDto dto, CancellationToken ct = default);
}
