using Microsoft.EntityFrameworkCore;
using Reporting.Domain.Model;

namespace Reporting.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet
        public DbSet<DashboardStat> DashboardStats { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Valuation> Valuations { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== RELATIONSHIPS =====
            // Order - Product (1..* many-to-many simplified)
            modelBuilder.Entity<Order>()
                .HasMany<Product>()
                .WithMany()
                .UsingEntity(j => j.ToTable("OrderProducts"));

            // Valuation - Staff (1 staff can handle many valuations)
            modelBuilder.Entity<Valuation>()
                .HasOne<Staff>()
                .WithMany()
                .HasForeignKey(v => v.Id)
                .OnDelete(DeleteBehavior.Restrict);

            // Activity - Staff (each activity logged by staff, optional)
            //modelBuilder.Entity<Activity>()
            //    .HasOne<Staff>()
            //    .WithMany()
            //    .HasForeignKey(a => a.Id)
            //    .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<DashboardStat>(entity =>
            {
                entity.Property(e => e.TotalRevenue)
                      .HasPrecision(18, 2);  // tổng cộng 18 số, 2 số thập phân
                entity.Property(e => e.MonthlyRevenue)
                      .HasPrecision(18, 2);
            });

            // Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(e => e.Total)
                      .HasPrecision(18, 2);
            });

            // Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.Price)
                      .HasPrecision(18, 2);
            });

            // ===== SEED DATA =====
            //DbSeeder.Seed();
        }
    }
}
