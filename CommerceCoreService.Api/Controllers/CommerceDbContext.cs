using Microsoft.EntityFrameworkCore;
using CommerceCoreService.Api.Controllers;

namespace CommerceCoreService.Api.Controllers;

public class CommerceDbContext : DbContext
{
    public CommerceDbContext(DbContextOptions<CommerceDbContext> options) : base(options) { }

    public DbSet<Transaction> Transactions { get; set; }
}