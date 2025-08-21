using Microsoft.EntityFrameworkCore;
using Product.Application.Interfaces;
using Product.Domain.Entities;
using Product.Infrastructure.Data;

namespace Product.Infrastructure.Repositories;

public class DiamondRepository : IDiamondRepository
{
    private readonly ProductDbContext _db;
    public DiamondRepository(ProductDbContext db) => _db = db;

    public Task<Diamond?> GetByIdAsync(Guid id, CancellationToken ct)
        => _db.Diamonds.FirstOrDefaultAsync(x => x.Id == id, ct);

    public Task<Diamond?> GetByCodeAsync(string code, CancellationToken ct)
        => _db.Diamonds.FirstOrDefaultAsync(x => x.Code == code, ct);

    public Task<Diamond?> GetByCertificateAsync(string certificateCode, CancellationToken ct)
        => _db.Diamonds.FirstOrDefaultAsync(x => x.CertificateCode == certificateCode, ct);

    public async Task<List<Diamond>> SearchAsync(string? shape, string? color, string? clarity, int skip, int take, CancellationToken ct)
    {
        var q = _db.Diamonds.AsQueryable();
        if (!string.IsNullOrWhiteSpace(shape)) q = q.Where(d => d.Shape == shape);
        if (!string.IsNullOrWhiteSpace(color)) q = q.Where(d => d.Color == color);
        if (!string.IsNullOrWhiteSpace(clarity)) q = q.Where(d => d.Clarity == clarity);
        return await q.OrderByDescending(d => d.CreatedAt).Skip(skip).Take(take).ToListAsync(ct);
    }

    public async Task<Diamond> AddAsync(Diamond diamond, CancellationToken ct)
    {
        var e = await _db.Diamonds.AddAsync(diamond, ct);
        return e.Entity;
    }

    public Task SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}
