namespace Inventory.Application.DTOs;

public class CreateOrUpdateInventoryItemDto
{
    public string Sku { get; set; } = default!;
    public int QuantityOnHand { get; set; }   // đặt số lượng tồn hiện tại
}
