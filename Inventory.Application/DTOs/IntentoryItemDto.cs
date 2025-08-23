namespace Inventory.Application.DTOs;

public class InventoryItemDto
{
    public string Sku { get; set; } = default!;
    public int QuantityOnHand { get; set; }
    public int QuantityReserved { get; set; }
    public int Available => QuantityOnHand - QuantityReserved;
}