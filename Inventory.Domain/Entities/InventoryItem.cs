namespace Inventory.Domain.Entities;

public class InventoryItem
{
    public Guid Id { get; set; }
    public string SKU { get; set; } = default!;
    public int Quantity { get; set; }
    public string Location { get; set; } = "MainWarehouse";
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
