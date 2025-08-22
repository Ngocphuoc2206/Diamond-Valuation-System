using Inventory.Domain.Entities;

namespace Inventory.Domain.Repositories;

public interface IInventoryRepository
{
    Task<IEnumerable<InventoryItem>> GetAllAsync();
    Task<InventoryItem?> GetBySkuAsync(string sku);
    Task AddAsync(InventoryItem item);
    Task UpdateAsync(InventoryItem item);
    Task DeleteAsync(Guid id);
}
