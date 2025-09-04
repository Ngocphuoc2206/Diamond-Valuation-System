using Catalog.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Db
{
    public class CatalogDbContext : DbContext
    {
        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // modelBuilder.Entity<Product>().ToTable("Products", schema: "catalog");

                modelBuilder.Entity<Product>(entity =>
                {
                    entity.ToTable("Product"); // Tên bảng trong database phải trùng

                    entity.HasKey(e => e.Id); // Khóa chính

                    entity.Property(e => e.Name)
                        .IsRequired()
                        .HasMaxLength(255);

                    entity.Property(e => e.Carat)
                        .HasColumnType("decimal(18,2)");

                    entity.Property(e => e.Price)
                        .HasColumnType("decimal(18,2)");

                    entity.Property(e => e.Color)
                        .IsRequired()
                        .HasMaxLength(50);

                    entity.Property(e => e.Clarity)
                        .IsRequired()
                        .HasMaxLength(50);

                    entity.Property(e => e.Cut)
                        .IsRequired()
                        .HasMaxLength(50);

                    entity.Property(e => e.Shape)
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasDefaultValue(string.Empty);
                });
            }
        }
    }
