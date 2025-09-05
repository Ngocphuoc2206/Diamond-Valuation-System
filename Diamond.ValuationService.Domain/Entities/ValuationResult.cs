namespace Diamond.ValuationService.Domain.Entities;

public class ValuationResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RequestId { get; set; }
    public decimal PricePerCarat { get; set; }
    public decimal TotalPrice { get; set; }
    public string Currency { get; set; } = "USD";
    public string AlgorithmVersion { get; set; } = "1.0.0";
    public DateTime ValuatedAt { get; set; } = DateTime.UtcNow;
    public string Notes { get; set; } = "";
}
