using Microsoft.EntityFrameworkCore;

namespace Payment.Infrastructure.Data;

public class PaymentDbContext : DbContext
{
    public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options) { }
    public DbSet<Payment.Domain.Entities.Payment> Payments => Set<Payment.Domain.Entities.Payment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Payment.Domain.Entities.Payment>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Method).HasMaxLength(30).IsRequired();
            e.Property(x => x.Currency).HasMaxLength(10).IsRequired();
            e.Property(x => x.OrderCode).HasMaxLength(100).IsRequired();
            e.HasIndex(x => x.IdempotencyKey).IsUnique(false);
        });
    }
}
