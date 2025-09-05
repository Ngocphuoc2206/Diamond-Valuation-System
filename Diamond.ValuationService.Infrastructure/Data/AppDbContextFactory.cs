using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Diamond.ValuationService.Infrastructure.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var cs = Environment.GetEnvironmentVariable("ConnectionStrings__SqlServer")
                     ?? "Server=localhost,1433;Database=DiamondDb;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True";

            var builder = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer(cs);

            return new AppDbContext(builder.Options);
        }
    }
}
