namespace Inventory.Domain.Entities;

public class InventoryItem
{
    public int Id { get; set; }
    public string Sku { get; set; } = default!;
    public int QuantityOnHand { get; set; }     // tổng tồn
    public int QuantityReserved { get; set; }   // đã giữ
    public byte[] RowVersion { get; set; } = Array.Empty<byte>(); // concurrency token

    public int Available => QuantityOnHand - QuantityReserved;
}
