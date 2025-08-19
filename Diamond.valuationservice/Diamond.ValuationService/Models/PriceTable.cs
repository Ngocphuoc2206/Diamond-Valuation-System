namespace Diamond.ValuationService.Models;

public class PriceTable
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public decimal CaratFrom { get; set; }
    public decimal CaratTo { get; set; }
    public decimal BasePricePerCarat { get; set; }
}
