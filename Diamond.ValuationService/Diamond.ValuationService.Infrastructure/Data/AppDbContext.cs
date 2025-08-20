using Diamond.ValuationService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Infrastructure.Data;   // PHẢI có .Data

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt) { }

    public DbSet<PriceTableEntry> PriceTable => Set<PriceTableEntry>();
    public DbSet<ValuationRequest> ValuationRequests => Set<ValuationRequest>();
    public DbSet<ValuationResult> ValuationResults => Set<ValuationResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ValuationRequest>().OwnsOne(v => v.Spec);
        base.OnModelCreating(modelBuilder);
    }
}
