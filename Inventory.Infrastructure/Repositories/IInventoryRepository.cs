using Inventory.Domain.Entities;

namespace Inventory.Domain.Repositories;

public interface IInventoryRepository
{
    // === InventoryItem ===
    Task<InventoryItem?> GetItemBySkuAsync(string sku, bool asNoTracking = true, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryItem>> GetAllItemsAsync(CancellationToken ct = default);
    Task AddItemAsync(InventoryItem item, CancellationToken ct = default);
    Task UpdateItemAsync(InventoryItem item, CancellationToken ct = default);
    Task RemoveItemAsync(InventoryItem item, CancellationToken ct = default);

    // === Reservation ===
    Task<bool> ExistsReservationAsync(string orderNo, CancellationToken ct = default);
    Task<InventoryReservation?> GetReservationAsync(string orderNo, bool includeLines = false, CancellationToken ct = default);
    Task AddReservationAsync(InventoryReservation reservation, CancellationToken ct = default);
    Task RemoveReservationAsync(InventoryReservation reservation, CancellationToken ct = default);

    // === Save/Tx ===
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task<IDisposable> BeginTransactionAsync(CancellationToken ct = default);
}
