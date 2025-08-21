using Product.Application.DTOs;
using Product.Application.Interfaces;
using Product.Domain.Entities;

namespace Product.Application.Services;

public interface ICatalogService
{
    Task<DiamondDto> CreateAsync(CreateDiamondRequest req, CancellationToken ct);
    Task<DiamondDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<List<DiamondDto>> SearchAsync(string? shape, string? color, string? clarity, int skip, int take, CancellationToken ct);
}

public class CatalogService : ICatalogService
{
    private readonly IDiamondRepository _repo;

    public CatalogService(IDiamondRepository repo)
    {
        _repo = repo;
    }

    public async Task<DiamondDto> CreateAsync(CreateDiamondRequest req, CancellationToken ct)
    {
        var e = new Diamond
        {
            Id = Guid.NewGuid(),
            Code = req.Code,
            CertificateCode = req.CertificateCode,
            Origin = req.Origin,
            Shape = req.Shape,
            Carat = req.Carat,
            Color = req.Color,
            Clarity = req.Clarity,
            Cut = req.Cut,
            Proportions = req.Proportions,
            Polish = req.Polish,
            Symmetry = req.Symmetry,
            Fluorescence = req.Fluorescence,
            Measurements = req.Measurements
        };
        await _repo.AddAsync(e, ct);
        await _repo.SaveChangesAsync(ct);
        return DiamondDto.FromEntity(e);
    }

    public async Task<DiamondDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var e = await _repo.GetByIdAsync(id, ct);
        return e is null ? null : DiamondDto.FromEntity(e);
    }

    public async Task<List<DiamondDto>> SearchAsync(string? shape, string? color, string? clarity, int skip, int take, CancellationToken ct)
    {
        var list = await _repo.SearchAsync(shape, color, clarity, skip, take, ct);
        return list.Select(DiamondDto.FromEntity).ToList();
    }
}
