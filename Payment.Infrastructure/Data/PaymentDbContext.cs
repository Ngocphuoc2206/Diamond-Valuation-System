using Microsoft.EntityFrameworkCore;
using Payment.Domain.Entities;

namespace Payment.Infrastructure.Data;

public class PaymentDbContext : DbContext
{
    public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options) { }

    public DbSet<Payment.Domain.Entities.Payment> Payments => Set<Payment.Domain.Entities.Payment>();
    public DbSet<Refund> Refunds => Set<Refund>();
    public DbSet<OutboxMessage> Outbox => Set<OutboxMessage>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Payment.Domain.Entities.Payment>(e =>
        {
            e.ToTable("payments");
            e.HasIndex(x => new { x.OrderNo, x.Provider }).IsUnique(false);
            e.Property(x => x.Amount).HasColumnType("decimal(18,2)");
            e.Property(x => x.IdempotencyKey).HasMaxLength(64);
        });

        mb.Entity<Refund>(e =>
        {
            e.ToTable("refunds");
            e.Property(x => x.Amount).HasColumnType("decimal(18,2)");
            e.HasOne(x => x.Payment).WithMany().HasForeignKey(x => x.PaymentId);
        });

        mb.Entity<OutboxMessage>(e =>
        {
            e.ToTable("outbox");
            e.Property(x => x.EventType).HasMaxLength(100).IsRequired();
        });
    }
}
