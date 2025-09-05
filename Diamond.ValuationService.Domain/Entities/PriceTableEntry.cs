namespace Diamond.ValuationService.Domain.Entities;

public class PriceTableEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Origin { get; set; } = "Natural";
    public string Shape { get; set; } = "Round";
    public string Color { get; set; } = "G";
    public string Clarity { get; set; } = "VS1";
    public decimal CaratFrom { get; set; } // 0.90
    public decimal CaratTo { get; set; }   // 0.99
    public decimal BasePricePerCarat { get; set; } // ví dụ 7000 (USD/ct)
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow.Date;
}
