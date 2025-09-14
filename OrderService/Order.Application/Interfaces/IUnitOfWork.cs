using SharedLibrary.Interfaces;
using Order.Domain.Entities;

namespace Order.Application.Interfaces;

public interface IUnitOfWork
{
    IGenericRepository<Cart> Carts { get; }
    IGenericRepository<CartItem> CartItems { get; }
    IGenericRepository<Order.Domain.Entities.Order> Orders { get; }
    IGenericRepository<OrderItem> OrderItems { get; }
    Task<int> SaveChangesAsync();
}
