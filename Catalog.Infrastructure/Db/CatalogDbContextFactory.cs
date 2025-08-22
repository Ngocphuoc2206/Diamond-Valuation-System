using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Catalog.Infrastructure.Db
{
    public class CatalogDbContextFactory : IDesignTimeDbContextFactory<CatalogDbContext>
    {
        public CatalogDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<CatalogDbContext>();
            // Connection string dùng cho design time
            optionsBuilder.UseSqlServer("Server=localhost,1433;Database=CatalogDb;User Id=sa;Password=YourStrong!Passw0rd123;");

            return new CatalogDbContext(optionsBuilder.Options);
        }
    }
}
