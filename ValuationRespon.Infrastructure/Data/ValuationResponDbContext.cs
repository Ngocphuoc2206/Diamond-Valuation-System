using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Infrastructure.Data
{
    public class ValuationResponDbContext : DbContext
    {
        public ValuationResponDbContext(DbContextOptions<ValuationResponDbContext> options) : base(options) { }

        public DbSet<ValuationCase> ValuationCases { get; set; }
        public DbSet<ValuationTimeline> ValuationTimelines { get; set; }
        public DbSet<ValuationResult> ValuationResults { get; set; }
    }
}
