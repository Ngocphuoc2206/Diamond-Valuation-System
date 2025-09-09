using Microsoft.EntityFrameworkCore;
using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Infrastructure.Data
{
    public class ValuationResponDbContext : DbContext
    {
        public ValuationResponDbContext(DbContextOptions<ValuationResponDbContext> options) : base(options) { }

        public DbSet<ValuationCase> ValuationCases { get; set; } = default!;
        public DbSet<ValuationTimeline> ValuationTimelines { get; set; } = default!;
        public DbSet<ValuationResult> ValuationResults { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder mb)
        {
            // ===== ValuationCase =====
            mb.Entity<ValuationCase>(e =>
            {
                e.HasKey(x => x.Id);

                // Thông tin KH
                e.Property(x => x.FullName).HasMaxLength(200).IsRequired();
                e.Property(x => x.Email).HasMaxLength(200).IsRequired();
                e.Property(x => x.Phone).HasMaxLength(30).IsRequired();

                // Thông tin kim cương
                e.Property(x => x.CertificateNo).HasMaxLength(50);
                e.Property(x => x.Origin).HasMaxLength(50).IsRequired();
                e.Property(x => x.Shape).HasMaxLength(50).IsRequired();
                e.Property(x => x.Color).HasMaxLength(10).IsRequired();
                e.Property(x => x.Clarity).HasMaxLength(10).IsRequired();
                e.Property(x => x.Cut).HasMaxLength(20).IsRequired();
                e.Property(x => x.Polish).HasMaxLength(20).IsRequired();
                e.Property(x => x.Symmetry).HasMaxLength(20).IsRequired();
                e.Property(x => x.Fluorescence).HasMaxLength(20).IsRequired();

                // Thời gian
                e.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                e.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Trạng thái & người xử lý
                e.Property(x => x.Status).HasMaxLength(30).HasDefaultValue("Pending");
                e.HasIndex(x => x.Status);
                e.HasIndex(x => x.AssigneeId);
                e.HasIndex(x => x.CreatedAt);
            });

            // ===== ValuationTimeline: Case (1) -> (n) Timeline =====
            mb.Entity<ValuationTimeline>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne<ValuationCase>()
                 .WithMany(c => c.Timelines)
                 .HasForeignKey(x => x.ValuationCaseId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.Property(x => x.Step).HasMaxLength(50).IsRequired(); // Contacted/Scheduled/Valuation/...
                e.Property(x => x.Note).HasMaxLength(1000).HasDefaultValue(string.Empty);

                e.Property(x => x.Timestamp).HasDefaultValueSql("GETUTCDATE()");
                e.HasIndex(x => new { x.ValuationCaseId, x.Timestamp });
            });

            // ===== ValuationResult: Case (1) -> (1) Result =====
            mb.Entity<ValuationResult>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne<ValuationCase>()
                 .WithOne(c => c.Result)
                 .HasForeignKey<ValuationResult>(x => x.ValuationCaseId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Precision tiền tệ
                e.Property(x => x.MarketValue).HasColumnType("decimal(18,2)");
                e.Property(x => x.InsuranceValue).HasColumnType("decimal(18,2)");
                e.Property(x => x.RetailValue).HasColumnType("decimal(18,2)");

                e.Property(x => x.Condition).HasMaxLength(100).HasDefaultValue(string.Empty);
                e.Property(x => x.Certification).HasMaxLength(500).HasDefaultValue(string.Empty);
                e.Property(x => x.Notes).HasMaxLength(2000);

                e.Property(x => x.CompletedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasIndex(x => x.ValuationCaseId).IsUnique(); // mỗi Case chỉ có 1 Result
            });
        }
    }
}
