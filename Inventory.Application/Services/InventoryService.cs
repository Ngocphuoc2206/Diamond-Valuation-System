using Inventory.Domain.Entities;
using Inventory.Domain.Repositories;
using Inventory.Infrastructure.Interfaces;
using Inventory.Infrastructure.Repositories;

namespace Inventory.Application.Services;

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _repo;

    public InventoryService(IInventoryRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<InventoryItem>> GetAllAsync()
        => await _repo.GetAllAsync();

    public async Task<InventoryItem?> GetBySkuAsync(string sku)
        => await _repo.GetBySkuAsync(sku);

    public async Task AddAsync(InventoryItem item)
    {
        item.LastUpdated = DateTime.UtcNow;
        await _repo.AddAsync(item);
    }

    public async Task UpdateAsync(InventoryItem item)
    {
        item.LastUpdated = DateTime.UtcNow;
        await _repo.UpdateAsync(item);
    }

    public async Task DeleteAsync(Guid id)
        => await _repo.DeleteAsync(id);
}
