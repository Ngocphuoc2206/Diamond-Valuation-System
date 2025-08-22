using Microsoft.EntityFrameworkCore;
using Product.Domain.Entities;

namespace Product.Infrastructure.Persistence
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options) { }

        // Bảng sản phẩm chung
        public DbSet<Domain.Entities.Product> Products => Set<Domain.Entities.Product>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Table per Type (TPT): mỗi entity con có bảng riêng
            object value = modelBuilder.Entity<Domain.Entities.Product>().ToTable("Products");
        }
    }
}
