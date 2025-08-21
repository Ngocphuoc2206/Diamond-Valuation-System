using ContentKnowledgeService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace ContentKnowledgeService.Infrastructure.Persistence;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        var conn = "Server=localhost;Database=Diamond_Content;User Id=sa;Password=Your_strong_password_123;TrustServerCertificate=True;";
        optionsBuilder.UseSqlServer(conn);
        return new AppDbContext(optionsBuilder.Options);
    }
}
