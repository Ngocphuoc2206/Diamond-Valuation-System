using Microsoft.EntityFrameworkCore;
using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Infrastructure.Data
{
    public class ValuationResponDbContext : DbContext
    {
        public ValuationResponDbContext(DbContextOptions<ValuationResponDbContext> options) : base(options) { }

        // CHỈ GIỮ ValuationResults
        public DbSet<ValuationResult> ValuationResults { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder mb)
        {
            // ===== ValuationResult =====
            mb.Entity<ValuationResult>(e =>
            {
                e.ToTable("ValuationResults");
                e.HasKey(x => x.Id);

                e.Property(x => x.CaseId).IsRequired();

                e.Property(x => x.CertificateNo)
                    .HasMaxLength(100);

                e.Property(x => x.PricePerCarat)
                    .HasColumnType("decimal(18,2)");

                e.Property(x => x.TotalPrice)
                    .HasColumnType("decimal(18,2)");

                e.Property(x => x.Currency)
                    .HasMaxLength(10);

                e.Property(x => x.CustomerName)
                    .HasMaxLength(200);

                e.Property(x => x.ValuationName)
                    .HasMaxLength(200);

                e.Property(x => x.AlgorithmVersion)
                    .HasMaxLength(32);

                e.Property(x => x.CreatedAt)
                 .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}
