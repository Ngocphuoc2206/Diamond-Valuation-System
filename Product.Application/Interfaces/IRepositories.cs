using Product.Domain.Entities;

namespace Product.Application.Interfaces;

public interface IDiamondRepository
{
    Task<Diamond?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Diamond?> GetByCodeAsync(string code, CancellationToken ct);
    Task<Diamond?> GetByCertificateAsync(string certificateCode, CancellationToken ct);
    Task<List<Diamond>> SearchAsync(string? shape, string? color, string? clarity, int skip, int take, CancellationToken ct);
    Task<Diamond> AddAsync(Diamond diamond, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public interface IPriceSourceRepository
{
    Task<PriceSource?> GetByNameAsync(string name, CancellationToken ct);
    Task<PriceSource> AddAsync(PriceSource source, CancellationToken ct);
    Task AddSnapshotAsync(PriceSnapshot snap, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
