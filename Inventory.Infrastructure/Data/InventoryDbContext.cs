using Inventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Infrastructure.Data;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();
    public DbSet<InventoryReservation> InventoryReservations => Set<InventoryReservation>();
    public DbSet<InventoryReservationLine> InventoryReservationLines => Set<InventoryReservationLine>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<InventoryItem>()
            .HasIndex(x => x.Sku).IsUnique();
        b.Entity<InventoryItem>()
            .Property(x => x.RowVersion)
            .IsRowVersion();

        b.Entity<InventoryReservation>()
            .HasIndex(x => x.OrderNo).IsUnique();

        b.Entity<InventoryReservationLine>()
            .HasOne(x => x.Reservation)
            .WithMany(x => x.Lines)
            .HasForeignKey(x => x.ReservationId);
    }
}
