using InvoiceService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InvoiceService.Infrastructure.Data;

public class InvoiceDbContext : DbContext
{
    public InvoiceDbContext(DbContextOptions<InvoiceDbContext> options) : base(options) {}
    public DbSet<Receipt> Receipts => Set<Receipt>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(InvoiceDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
