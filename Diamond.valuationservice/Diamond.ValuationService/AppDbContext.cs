using Microsoft.EntityFrameworkCore;
using Diamond.ValuationService.Models;   // << thêm dòng này

namespace Diamond.ValuationService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<DiamondSpec> DiamondSpecs => Set<DiamondSpec>();
    public DbSet<PriceTable>  PriceTables  => Set<PriceTable>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<DiamondSpec>().OwnsOne(x => x.Measurements);
    }
}
