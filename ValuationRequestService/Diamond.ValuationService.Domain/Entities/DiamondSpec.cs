namespace Diamond.ValuationService.Domain.Entities;

public class DiamondSpec
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Origin { get; set; } = "Natural"; // Natural/Lab
    public string Shape { get; set; } = "Round";
    public decimal Carat { get; set; } // 0.3, 1.0, 2.5...
    public string Color { get; set; } = "G"; // D..Z
    public string Clarity { get; set; } = "VS1"; // IF,VVS1,VVS2,VS1,VS2,SI1,SI2,...
    public string Cut { get; set; } = "Excellent"; // Excellent, VeryGood, Good...
    public string Polish { get; set; } = "Excellent";
    public string Symmetry { get; set; } = "Excellent";
    public string Fluorescence { get; set; } = "None"; // None,Faint,Medium,Strong
    public decimal TablePercent { get; set; } // tỉ lệ mặt bàn (%)
    public decimal DepthPercent { get; set; } // độ sâu (%)
    public string Measurements { get; set; } = ""; // "6.45-6.49x3.95mm"
}
