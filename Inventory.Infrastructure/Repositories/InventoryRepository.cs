using System.Data;
using Inventory.Domain.Entities;
using Inventory.Domain.Repositories;
using Inventory.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Inventory.Infrastructure.Repositories;

public class InventoryRepository : IInventoryRepository
{
    private readonly InventoryDbContext _db;

    public InventoryRepository(InventoryDbContext db) => _db = db;

    // === InventoryItem ===
    public async Task<InventoryItem?> GetItemBySkuAsync(string sku, bool asNoTracking = true, CancellationToken ct = default)
    {
        var q = _db.InventoryItems.AsQueryable();
        if (asNoTracking) q = q.AsNoTracking();
        return await q.SingleOrDefaultAsync(x => x.Sku == sku, ct);
    }

    public async Task<IReadOnlyList<InventoryItem>> GetAllItemsAsync(CancellationToken ct = default)
        => await _db.InventoryItems.AsNoTracking().ToListAsync(ct);

    public Task AddItemAsync(InventoryItem item, CancellationToken ct = default)
    {
        _db.InventoryItems.Add(item);
        return Task.CompletedTask;
    }

    public Task UpdateItemAsync(InventoryItem item, CancellationToken ct = default)
    {
        _db.InventoryItems.Update(item);
        return Task.CompletedTask;
    }

    public Task RemoveItemAsync(InventoryItem item, CancellationToken ct = default)
    {
        _db.InventoryItems.Remove(item);
        return Task.CompletedTask;
    }

    // === Reservation ===
    public async Task<bool> ExistsReservationAsync(string orderNo, CancellationToken ct = default)
        => await _db.InventoryReservations.AsNoTracking().AnyAsync(r => r.OrderNo == orderNo, ct);

    public async Task<InventoryReservation?> GetReservationAsync(string orderNo, bool includeLines = false, CancellationToken ct = default)
    {
        IQueryable<InventoryReservation> q = _db.InventoryReservations;
        if (includeLines) q = q.Include(r => r.Lines);
        return await q.SingleOrDefaultAsync(r => r.OrderNo == orderNo, ct);
    }

    public Task AddReservationAsync(InventoryReservation reservation, CancellationToken ct = default)
    {
        _db.InventoryReservations.Add(reservation);
        return Task.CompletedTask;
    }

    public Task RemoveReservationAsync(InventoryReservation reservation, CancellationToken ct = default)
    {
        _db.InventoryReservations.Remove(reservation);
        return Task.CompletedTask;
    }

    // === Save/Tx ===
    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);

    public async Task<IDisposable> BeginTransactionAsync(CancellationToken ct = default)
    {
        var tx = await _db.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted, ct);
        return tx; // IDbContextTransaction implements IDisposable
    }
}
