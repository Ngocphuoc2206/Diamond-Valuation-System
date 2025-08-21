using Microsoft.EntityFrameworkCore;
using Product.Application.Interfaces;
using Product.Domain.Entities;
using Product.Infrastructure.Data;

namespace Product.Infrastructure.Repositories;

public class PriceSourceRepository : IPriceSourceRepository
{
    private readonly ProductDbContext _db;
    public PriceSourceRepository(ProductDbContext db) => _db = db;

    public Task<PriceSource?> GetByNameAsync(string name, CancellationToken ct)
        => _db.PriceSources.Include(x => x.Snapshots).FirstOrDefaultAsync(x => x.Name == name, ct);

    public async Task<PriceSource> AddAsync(PriceSource source, CancellationToken ct)
    {
        var e = await _db.PriceSources.AddAsync(source, ct);
        return e.Entity;
    }

    public Task AddSnapshotAsync(PriceSnapshot snap, CancellationToken ct)
        => _db.PriceSnapshots.AddAsync(snap, ct).AsTask();

    public Task SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}
