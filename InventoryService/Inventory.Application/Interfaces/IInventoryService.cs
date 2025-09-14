using Inventory.Application.DTOs;
using Inventory.Domain.Entities;
using SharedLibrary.Messaging.Events;

namespace Inventory.Application.Interfaces;

public interface IInventoryService
{
    Task<InventoryItemDto?> GetAsync(string sku);
    Task<IReadOnlyList<InventoryItemDto>> GetAllAsync();
    Task<InventoryItemDto> UpsertAsync(CreateOrUpdateInventoryItemDto dto); // tạo mới hoặc cập nhật QuantityOnHand
    Task<bool> AdjustQuantityAsync(string sku, int delta);                   // tăng/giảm tồn
    Task<bool> DeleteAsync(string sku);

    /// <summary>Giữ chỗ tồn kho cho một đơn (idempotent theo OrderNo).</summary>
    Task<(bool Success, string? Reason)> TryReserveAsync(string orderNo, IEnumerable<OrderItemDto> items);

    /// <summary>Xác nhận (trừ thực) tồn kho sau khi thanh toán thành công.</summary>
    Task ConfirmAsync(string orderNo);

    /// <summary>Hủy giữ chỗ, trả tồn kho (khi thanh toán fail/hủy).</summary>
    Task CancelReservationAsync(string orderNo);

    /// <summary>Lấy số lượng khả dụng cho SKU.</summary>
    Task<int> GetAvailableAsync(string sku);
}
