using Order.Domain.Entities;
namespace Order.Domain.Interfaces;

public interface IOrderRepository
{
    Task<Order.Domain.Entities.Order?> GetByOrderNoAsync(string orderNo, bool includeItems = false, CancellationToken ct = default);
    Task UpdateAsync(Order.Domain.Entities.Order order, CancellationToken ct = default);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
