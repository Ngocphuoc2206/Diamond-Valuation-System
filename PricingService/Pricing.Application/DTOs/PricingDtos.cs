namespace Pricing.Application.DTOs;

public record PriceUpsertDto(
    string PriceListCode,
    string Sku,
    decimal Amount,
    string Currency,
    DateTime EffectiveFrom,
    DateTime? EffectiveTo,
    string? CustomerGroup
);

public record GetEffectivePriceQuery(
    string Sku,
    string? PriceListCode,
    string? CustomerGroup,
    DateTime? AtUtc // nếu null -> DateTime.UtcNow
);

public record EffectivePriceDto(
    string Sku,
    decimal Amount,
    string Currency,
    string PriceListCode,
    DateTime EffectiveFrom,
    DateTime? EffectiveTo,
    string? CustomerGroup
);
