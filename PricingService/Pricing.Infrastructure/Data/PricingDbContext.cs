using Microsoft.EntityFrameworkCore;
using Pricing.Domain.Entities;

namespace Pricing.Infrastructure.Data;

public class PricingDbContext : DbContext
{
    public PricingDbContext(DbContextOptions<PricingDbContext> options) : base(options) { }

    public DbSet<PriceList> PriceLists => Set<PriceList>();
    public DbSet<Price> Prices => Set<Price>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<PriceList>(e =>
        {
            e.ToTable("price_lists");
            e.Property(x => x.Code).HasMaxLength(50).IsRequired();
            e.HasIndex(x => x.Code).IsUnique();
            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
        });

        mb.Entity<Price>(e =>
        {
            e.ToTable("prices");
            e.Property(x => x.Sku).HasMaxLength(64).IsRequired();
            e.Property(x => x.Currency).HasMaxLength(10).IsRequired();
            e.Property(x => x.Amount).HasColumnType("decimal(18,2)");
            e.Property(x => x.CustomerGroup).HasMaxLength(50);
            e.HasOne(p => p.PriceList).WithMany(l => l.Prices).HasForeignKey(p => p.PriceListId);
            e.HasIndex(x => new { x.PriceListId, x.Sku, x.CustomerGroup, x.EffectiveFrom, x.EffectiveTo });
        });
    }
}
