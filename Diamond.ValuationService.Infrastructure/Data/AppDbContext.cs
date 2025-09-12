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

    // 🔹 DbSet cho lịch sử liên hệ
    public DbSet<ContactLog> ContactLogs => Set<ContactLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---- Contact ----
        modelBuilder.Entity<Contact>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.FullName).IsRequired().HasMaxLength(200);
            e.Property(x => x.Email).IsRequired().HasMaxLength(200);
            e.Property(x => x.Phone).IsRequired().HasMaxLength(30);

            // PreferredMethod thường không bắt buộc -> để Optional cho an toàn
            e.Property(x => x.PreferredMethod).HasMaxLength(50);
            e.HasIndex(x => x.UserId);
        });

        // ---- ValuationCase ----
        modelBuilder.Entity<ValuationCase>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.UserId);

            // Enum Status -> string để dễ đọc/truy vấn
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);

            e.Property(x => x.CertificateNo).HasMaxLength(100);
            e.Property(x => x.Origin).IsRequired().HasMaxLength(50);
            e.Property(x => x.Shape).IsRequired().HasMaxLength(50);
            e.Property(x => x.Carat).HasPrecision(10, 3);
            e.Property(x => x.Color).IsRequired().HasMaxLength(10);
            e.Property(x => x.Clarity).IsRequired().HasMaxLength(10);
            e.Property(x => x.Cut).IsRequired().HasMaxLength(20);
            e.Property(x => x.Polish).IsRequired().HasMaxLength(20);
            e.Property(x => x.Symmetry).IsRequired().HasMaxLength(20);
            e.Property(x => x.Fluorescence).IsRequired().HasMaxLength(20);
            e.Property(x => x.EstimatedValue).HasPrecision(18, 2);

            e.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.UpdatedAt);

            e.Property(x => x.ValuationId);
            e.Property(x => x.ValuationName).HasMaxLength(100);

            e.HasOne(x => x.Contact)
                .WithMany(c => c.Cases)
                .HasForeignKey(x => x.ContactId)
                .OnDelete(DeleteBehavior.Restrict);

            // (tuỳ bạn có dùng navigation không)
            e.HasOne(x => x.Request)
                .WithMany()
                .HasForeignKey(x => x.RequestId)
                .OnDelete(DeleteBehavior.Restrict);

            // 1 case -> nhiều contact logs
            e.HasMany(x => x.ContactLogs)
                .WithOne(l => l.Case)
                .HasForeignKey(l => l.CaseId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ---- ContactLog (mới) ----
        modelBuilder.Entity<ContactLog>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Channel).IsRequired().HasMaxLength(20);    // phone|sms|email|zalo
            e.Property(x => x.Outcome).IsRequired().HasMaxLength(30);    // connected|no_answer|busy|wrong_number
            e.Property(x => x.Note).HasMaxLength(2000);
            e.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(x => new { x.CaseId, x.CreatedAt });
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
