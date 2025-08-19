namespace Diamond.ValuationService.Models;

public record Measurements(decimal L, decimal W, decimal H);

public class DiamondSpec
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Origin { get; set; } = "Natural";
    public string Shape  { get; set; } = "Round";
    public Measurements Measurements { get; set; } = new(0,0,0);
    public decimal CaratWeight { get; set; }
    public string Color { get; set; } = "";
    public string Clarity { get; set; } = "";
    public string Cut { get; set; } = "";
    public string Proportions { get; set; } = "";
    public string Polish { get; set; } = "";
    public string Symmetry { get; set; } = "";
    public string Fluorescence { get; set; } = "";
}
