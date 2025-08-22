using Microsoft.EntityFrameworkCore;
using Order.Domain.Entities;

namespace Order.Infrastructure.Data;

public class OrderDbContext : DbContext
{
    public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }

    public DbSet<Order.Domain.Entities.Order> Orders => Set<Order.Domain.Entities.Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Cart>(e =>
        {
            e.ToTable("carts");
            e.HasIndex(x => x.CartKey).IsUnique();
        });

        mb.Entity<CartItem>(e =>
        {
            e.ToTable("cart_items");
            e.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
        });

        mb.Entity<Order.Domain.Entities.Order>(e =>
        {
            e.ToTable("orders");
            e.HasIndex(x => x.OrderNo).IsUnique();
            e.Property(x => x.Subtotal).HasColumnType("decimal(18,2)");
            e.Property(x => x.Discount).HasColumnType("decimal(18,2)");
            e.Property(x => x.ShippingFee).HasColumnType("decimal(18,2)");
            e.Property(x => x.Total).HasColumnType("decimal(18,2)");
        });

        mb.Entity<OrderItem>(e =>
        {
            e.ToTable("order_items");
            e.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            e.Property(x => x.LineTotal).HasColumnType("decimal(18,2)");
        });
    }
}
