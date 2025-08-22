using Order.Application.Interfaces;
using Order.Domain.Entities;
using Order.Infrastructure.Data;
using SharedLibrary.Interfaces;

namespace Order.Infrastructure.UnitOfWork;

public class Uow : IUnitOfWork
{
    private readonly OrderDbContext _db;
    public Uow(OrderDbContext db,
        IGenericRepository<Cart> cart,
        IGenericRepository<CartItem> cartItem,
        IGenericRepository<Order.Domain.Entities.Order> order,
        IGenericRepository<OrderItem> orderItem)
    {
        _db = db;
        Carts = cart; CartItems = cartItem; Orders = order; OrderItems = orderItem;
    }

    public IGenericRepository<Cart> Carts { get; }
    public IGenericRepository<CartItem> CartItems { get; }
    public IGenericRepository<Order.Domain.Entities.Order> Orders { get; }
    public IGenericRepository<OrderItem> OrderItems { get; }

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();
}
