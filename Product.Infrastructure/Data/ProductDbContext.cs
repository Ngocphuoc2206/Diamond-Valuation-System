using Microsoft.EntityFrameworkCore;
using Product.Domain.Entities;

namespace Product.Infrastructure.Data;

public class ProductDbContext : DbContext
{
    public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options) { }

    public DbSet<Diamond> Diamonds => Set<Diamond>();
    public DbSet<PriceSource> PriceSources => Set<PriceSource>();
    public DbSet<PriceSnapshot> PriceSnapshots => Set<PriceSnapshot>();
    public DbSet<Certificate> Certificates => Set<Certificate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Diamond>()
            .HasIndex(d => d.Code)
            .IsUnique();

        modelBuilder.Entity<Diamond>()
            .HasIndex(d => d.CertificateCode);

        modelBuilder.Entity<PriceSource>()
            .HasMany(s => s.Snapshots)
            .WithOne(s => s.PriceSource!)
            .HasForeignKey(s => s.PriceSourceId);

        modelBuilder.Entity<Certificate>()
            .HasIndex(c => c.CertificateCode)
            .IsUnique();
    }
}
