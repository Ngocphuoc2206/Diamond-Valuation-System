using ContentKnowledgeService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ContentKnowledgeService.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Content> Contents => Set<Content>();
    public DbSet<Knowledge> Knowledges => Set<Knowledge>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Content>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(200).IsRequired();
            e.Property(x => x.Slug).HasMaxLength(200);
            e.Property(x => x.Author).HasMaxLength(100);
        });

        modelBuilder.Entity<Knowledge>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(200).IsRequired();
            e.Property(x => x.Tags).HasMaxLength(300);
        });

        base.OnModelCreating(modelBuilder);
    }
}
