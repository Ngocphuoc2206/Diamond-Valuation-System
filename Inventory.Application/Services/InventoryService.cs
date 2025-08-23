using Inventory.Application.DTOs;
using Inventory.Application.Interfaces;
using Inventory.Domain.Entities;
using Inventory.Domain.Repositories;
using Microsoft.Extensions.Logging;
using SharedLibrary.Messaging.Events;

namespace Inventory.Application.Services;

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _repo;
    private readonly ILogger<InventoryService> _logger;

    public InventoryService(IInventoryRepository repo, ILogger<InventoryService> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    // CRUD
    public async Task<InventoryItemDto?> GetAsync(string sku)
    {
        var it = await _repo.GetItemBySkuAsync(sku, asNoTracking: true);
        return it is null ? null : new InventoryItemDto
        {
            Sku = it.Sku,
            QuantityOnHand = it.QuantityOnHand,
            QuantityReserved = it.QuantityReserved
        };
    }

    public async Task<IReadOnlyList<InventoryItemDto>> GetAllAsync()
    {
        var list = await _repo.GetAllItemsAsync();
        return list.Select(it => new InventoryItemDto
        {
            Sku = it.Sku,
            QuantityOnHand = it.QuantityOnHand,
            QuantityReserved = it.QuantityReserved
        }).ToList();
    }

    public async Task<InventoryItemDto> UpsertAsync(CreateOrUpdateInventoryItemDto dto)
    {
        var entity = await _repo.GetItemBySkuAsync(dto.Sku, asNoTracking: false);
        if (entity is null)
        {
            entity = new InventoryItem { Sku = dto.Sku, QuantityOnHand = dto.QuantityOnHand, QuantityReserved = 0 };
            await _repo.AddItemAsync(entity);
        }
        else
        {
            entity.QuantityOnHand = dto.QuantityOnHand;
            await _repo.UpdateItemAsync(entity);
        }

        await _repo.SaveChangesAsync();

        return new InventoryItemDto
        {
            Sku = entity.Sku,
            QuantityOnHand = entity.QuantityOnHand,
            QuantityReserved = entity.QuantityReserved
        };
    }

    public async Task<bool> AdjustQuantityAsync(string sku, int delta)
    {
        var entity = await _repo.GetItemBySkuAsync(sku, asNoTracking: false);
        if (entity is null) return false;

        var newOnHand = entity.QuantityOnHand + delta;
        if (newOnHand < entity.QuantityReserved)
            throw new InvalidOperationException($"Cannot set QuantityOnHand below reserved ({entity.QuantityReserved}).");

        entity.QuantityOnHand = newOnHand;
        await _repo.UpdateItemAsync(entity);
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string sku)
    {
        var entity = await _repo.GetItemBySkuAsync(sku, asNoTracking: false);
        if (entity is null) return false;
        if (entity.QuantityReserved > 0)
            throw new InvalidOperationException("Cannot delete item with active reservations.");

        await _repo.RemoveItemAsync(entity);
        await _repo.SaveChangesAsync();
        return true;
    }

    // Business
    public async Task<(bool Success, string? Reason)> TryReserveAsync(string orderNo, IEnumerable<OrderItemDto> items)
    {
        if (await _repo.ExistsReservationAsync(orderNo))
        {
            _logger.LogInformation("[Inventory] Order {OrderNo} đã reserve trước đó.", orderNo);
            return (true, null);
        }

        var lines = items.GroupBy(i => i.Sku)
                         .Select(g => new { Sku = g.Key, Qty = g.Sum(x => x.Quantity) })
                         .ToList();

        using var tx = await _repo.BeginTransactionAsync();

        var lacks = new List<string>();
        foreach (var l in lines)
        {
            var inv = await _repo.GetItemBySkuAsync(l.Sku, asNoTracking: false);
            if (inv is null) { lacks.Add($"{l.Sku}: not found"); continue; }
            if (inv.Available < l.Qty) lacks.Add($"{l.Sku}: need {l.Qty}, available {inv.Available}");
        }

        if (lacks.Count > 0)
        {
            var reason = "Not enough stock -> " + string.Join("; ", lacks);
            _logger.LogWarning("[Inventory] {Reason}", reason);
            return (false, reason);
        }

        foreach (var l in lines)
        {
            var inv = await _repo.GetItemBySkuAsync(l.Sku, asNoTracking: false);
            inv!.QuantityReserved += l.Qty;
            await _repo.UpdateItemAsync(inv);
        }

        var res = new InventoryReservation
        {
            OrderNo = orderNo,
            Lines = lines.Select(x => new InventoryReservationLine { Sku = x.Sku, Quantity = x.Qty }).ToList()
        };
        await _repo.AddReservationAsync(res);

        await _repo.SaveChangesAsync();
        // commit transaction khi dispose
        return (true, null);
    }

    public async Task ConfirmAsync(string orderNo)
    {
        var res = await _repo.GetReservationAsync(orderNo, includeLines: true);
        if (res is null) { _logger.LogWarning("[Inventory] Confirm: không có reservation {OrderNo}", orderNo); return; }
        if (res.Confirmed) { _logger.LogInformation("[Inventory] Confirm: {OrderNo} đã confirmed.", orderNo); return; }

        using var tx = await _repo.BeginTransactionAsync();

        foreach (var l in res.Lines)
        {
            var inv = await _repo.GetItemBySkuAsync(l.Sku, asNoTracking: false);
            if (inv is null) continue;

            inv.QuantityReserved -= l.Quantity;
            inv.QuantityOnHand -= l.Quantity;
            if (inv.QuantityReserved < 0) inv.QuantityReserved = 0;
            if (inv.QuantityOnHand < 0) inv.QuantityOnHand = 0;

            await _repo.UpdateItemAsync(inv);
        }

        res.Confirmed = true;
        await _repo.SaveChangesAsync();
    }

    public async Task CancelReservationAsync(string orderNo)
    {
        var res = await _repo.GetReservationAsync(orderNo, includeLines: true);
        if (res is null) { _logger.LogWarning("[Inventory] Cancel: không có reservation {OrderNo}", orderNo); return; }
        if (res.Confirmed) { _logger.LogInformation("[Inventory] Cancel: {OrderNo} đã confirmed, bỏ qua."); return; }

        using var tx = await _repo.BeginTransactionAsync();

        foreach (var l in res.Lines)
        {
            var inv = await _repo.GetItemBySkuAsync(l.Sku, asNoTracking: false);
            if (inv is null) continue;

            inv.QuantityReserved -= l.Quantity;
            if (inv.QuantityReserved < 0) inv.QuantityReserved = 0;

            await _repo.UpdateItemAsync(inv);
        }

        await _repo.RemoveReservationAsync(res);
        await _repo.SaveChangesAsync();
    }

    public async Task<int> GetAvailableAsync(string sku)
        => (await _repo.GetItemBySkuAsync(sku, asNoTracking: true))?.Available ?? 0;
}
