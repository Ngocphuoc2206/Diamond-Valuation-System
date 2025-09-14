namespace Inventory.Application.DTOs;

public class AdjustQuantityDto
{
    public string Sku { get; set; } = default!;
    public int Delta { get; set; }            // +10 tăng, -5 giảm
}
