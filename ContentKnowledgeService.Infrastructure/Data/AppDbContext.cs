using ContentKnowledgeService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ContentKnowledgeService.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Content> Contents => Set<Content>();
    public DbSet<Knowledge> Knowledges => Set<Knowledge>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasKey(x => x.Id);

        modelBuilder.Entity<Content>()
            .HasOne(c => c.Category)
            .WithMany()
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Knowledge>()
            .HasOne(c => c.Category)
            .WithMany()
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
