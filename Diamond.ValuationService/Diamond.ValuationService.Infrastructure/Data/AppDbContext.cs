using Diamond.ValuationService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ==== DbSets cũ dùng cho định giá ====
    public DbSet<DiamondSpec> DiamondSpecs => Set<DiamondSpec>();
    public DbSet<PriceTableEntry> PriceTable => Set<PriceTableEntry>();
    public DbSet<ValuationRequest> ValuationRequests => Set<ValuationRequest>();
    public DbSet<ValuationResult> ValuationResults => Set<ValuationResult>();

    // ==== DbSets mới cho quy trình / liên hệ ====
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<ValuationCase> ValuationCases => Set<ValuationCase>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---- Contact ----
        modelBuilder.Entity<Contact>(e =>
        {
            e.Property(x => x.FullName).IsRequired().HasMaxLength(200);
            e.Property(x => x.Email).IsRequired().HasMaxLength(200);
            e.Property(x => x.Phone).IsRequired().HasMaxLength(30);
            e.Property(x => x.PreferredMethod).IsRequired().HasMaxLength(50);
        });

        // ---- ValuationCase ----
        modelBuilder.Entity<ValuationCase>(e =>
        {
            e.Property(x => x.Origin).IsRequired().HasMaxLength(50);
            e.Property(x => x.Shape).IsRequired().HasMaxLength(50);
            e.Property(x => x.Carat).HasPrecision(10, 3);
            e.Property(x => x.Color).IsRequired().HasMaxLength(10);
            e.Property(x => x.Clarity).IsRequired().HasMaxLength(10);
            e.Property(x => x.Cut).IsRequired().HasMaxLength(20);
            e.Property(x => x.Polish).IsRequired().HasMaxLength(20);
            e.Property(x => x.Symmetry).IsRequired().HasMaxLength(20);
            e.Property(x => x.Fluorescence).IsRequired().HasMaxLength(20);

            e.HasOne(x => x.Contact)
             .WithMany(c => c.Cases)
             .HasForeignKey(x => x.ContactId);
        });

        // ---- DiamondSpec ----
        modelBuilder.Entity<DiamondSpec>(e =>
        {
            e.Property(x => x.Carat).HasPrecision(6, 3);
            e.Property(x => x.DepthPercent).HasPrecision(5, 2);
            e.Property(x => x.TablePercent).HasPrecision(5, 2);
        });

        // ---- PriceTableEntry ----
        modelBuilder.Entity<PriceTableEntry>(e =>
        {
            e.Property(x => x.BasePricePerCarat).HasPrecision(18, 2);
            e.Property(x => x.CaratFrom).HasPrecision(6, 3);
            e.Property(x => x.CaratTo).HasPrecision(6, 3);
        });

        // ---- ValuationResult ----
        modelBuilder.Entity<ValuationResult>(e =>
        {
            e.Property(x => x.PricePerCarat).HasPrecision(18, 2);
            e.Property(x => x.TotalPrice).HasPrecision(18, 2);
        });
    }
}
