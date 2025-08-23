using SharedKernel.Entites;

namespace Pricing.Domain.Entities;

public class Price : BaseEntity
{
    public int PriceListId { get; set; }
    public PriceList PriceList { get; set; } = default!;
    public string Sku { get; set; } = string.Empty;
    public string Currency { get; set; } = "VND";
    public decimal Amount { get; set; }

    // hiệu lực theo thời gian
    public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow.Date;
    public DateTime? EffectiveTo { get; set; } // null = vô thời hạn

    // (tuỳ chọn) phân nhóm khách 
    public string? CustomerGroup { get; set; } // "VIP", "RETAIL", "WHOLESALE"...
}
