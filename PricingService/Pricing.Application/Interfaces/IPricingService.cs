using SharedLibrary.Response;
using Pricing.Application.DTOs;

namespace Pricing.Application.Services.Interfaces;

public interface IPricingService
{
    Task<ApiResponse<EffectivePriceDto>> GetEffectiveAsync(GetEffectivePriceQuery q);
    Task<ApiResponse<bool>> UpsertAsync(PriceUpsertDto dto);
    Task<ApiResponse<IEnumerable<EffectivePriceDto>>> BulkGetEffectiveAsync(IEnumerable<GetEffectivePriceQuery> queries);
}
