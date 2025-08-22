using Inventory.Domain.Entities;

namespace Inventory.Infrastructure.Interfaces;

public interface IInventoryService
{
    Task<IEnumerable<InventoryItem>> GetAllAsync();
    Task<InventoryItem?> GetBySkuAsync(string sku);
    Task AddAsync(InventoryItem item);
    Task UpdateAsync(InventoryItem item);
    Task DeleteAsync(Guid id);
}
