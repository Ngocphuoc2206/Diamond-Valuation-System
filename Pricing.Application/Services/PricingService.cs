using Pricing.Application.DTOs;
using Pricing.Application.Interfaces;
using Pricing.Application.Services.Interfaces;
using Pricing.Domain.Entities;
using SharedLibrary.Response;

namespace Pricing.Application.Services;

public class PricingService : IPricingService
{
    private readonly IUnitOfWork _uow;
    public PricingService(IUnitOfWork uow) { _uow = uow; }

    public async Task<ApiResponse<EffectivePriceDto>> GetEffectiveAsync(GetEffectivePriceQuery q)
    {
        var now = (q.AtUtc ?? DateTime.UtcNow);

        var listCode = string.IsNullOrWhiteSpace(q.PriceListCode) ? "DEFAULT" : q.PriceListCode!.Trim();

        var candidates = await _uow.Prices.GetManyAsync(p =>
            p.Sku == q.Sku &&
            p.PriceList.Code == listCode &&
            (q.CustomerGroup == null || p.CustomerGroup == q.CustomerGroup) &&
            p.EffectiveFrom <= now &&
            (p.EffectiveTo == null || p.EffectiveTo >= now)
        );

        var price = candidates
            .OrderByDescending(p => p.CustomerGroup != null)   // ưu tiên có nhóm khớp
            .ThenByDescending(p => p.EffectiveFrom)
            .FirstOrDefault();

        if (price is null)
            return ApiResponse<EffectivePriceDto>.Failure("Price not found");

        var dto = new EffectivePriceDto(
            price.Sku, price.Amount, price.Currency,
            listCode, price.EffectiveFrom, price.EffectiveTo, price.CustomerGroup
        );
        return ApiResponse<EffectivePriceDto>.CreateSuccessResponse(dto, "Ok");
    }

    public async Task<ApiResponse<IEnumerable<EffectivePriceDto>>> BulkGetEffectiveAsync(IEnumerable<GetEffectivePriceQuery> queries)
    {
        var results = new List<EffectivePriceDto>();
        foreach (var q in queries)
        {
            var res = await GetEffectiveAsync(q);
            if (res.Success && res.Data != null) results.Add(res.Data);
        }
        IEnumerable<EffectivePriceDto> data = results; // upcast
        return ApiResponse<IEnumerable<EffectivePriceDto>>.CreateSuccessResponse(data, "Ok");
    }

    public async Task<ApiResponse<bool>> UpsertAsync(PriceUpsertDto dto)
    {
        var listCode = dto.PriceListCode.Trim();

        // tìm (hoặc tạo) PriceList
        var list = await _uow.PriceLists.GetByAsync(x => x.Code == listCode);
        if (list is null)
        {
            list = new PriceList { Code = listCode, Name = listCode, IsActive = true };
            await _uow.PriceLists.CreateAsync(list);
        }

        // tìm price trùng SKU + khoảng thời gian + group
        var exists = (await _uow.Prices.GetManyAsync(p =>
            p.PriceListId == list.Id &&
            p.Sku == dto.Sku &&
            p.CustomerGroup == dto.CustomerGroup &&
            p.EffectiveFrom == dto.EffectiveFrom &&
            p.EffectiveTo == dto.EffectiveTo
        )).FirstOrDefault();

        if (exists is null)
        {
            var price = new Price
            {
                PriceListId = list.Id,
                Sku = dto.Sku.Trim(),
                Amount = dto.Amount,
                Currency = dto.Currency.Trim(),
                EffectiveFrom = dto.EffectiveFrom,
                EffectiveTo = dto.EffectiveTo,
                CustomerGroup = dto.CustomerGroup
            };
            await _uow.Prices.CreateAsync(price);
        }
        else
        {
            exists.Amount = dto.Amount;
            exists.Currency = dto.Currency.Trim();
            await _uow.Prices.UpdateAsync(exists);
        }

        return ApiResponse<bool>.CreateSuccessResponse(true, "Upserted");
    }
}
