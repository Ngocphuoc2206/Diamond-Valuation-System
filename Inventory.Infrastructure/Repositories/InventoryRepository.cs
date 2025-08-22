using Inventory.Domain.Entities;
using Inventory.Domain.Repositories;
using Inventory.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Infrastructure.Repositories;

public class InventoryRepository : IInventoryRepository
{
    private readonly InventoryDbContext _context;

    public InventoryRepository(InventoryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InventoryItem>> GetAllAsync()
        => await _context.InventoryItems.ToListAsync();

    public async Task<InventoryItem?> GetBySkuAsync(string sku)
        => await _context.InventoryItems.FirstOrDefaultAsync(i => i.SKU == sku);

    public async Task AddAsync(InventoryItem item)
    {
        await _context.InventoryItems.AddAsync(item);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(InventoryItem item)
    {
        _context.InventoryItems.Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var item = await _context.InventoryItems.FindAsync(id);
        if (item != null)
        {
            _context.InventoryItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}
