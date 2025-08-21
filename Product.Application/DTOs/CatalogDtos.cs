using Product.Domain.Entities;

namespace Product.Application.DTOs;

public record DiamondDto(
    Guid Id,
    string Code,
    string? CertificateCode,
    string Origin,
    string Shape,
    decimal Carat,
    string Color,
    string Clarity,
    string Cut,
    string Proportions,
    string Polish,
    string Symmetry,
    string Fluorescence,
    string Measurements,
    decimal? EstimatedPrice
)
{
    public static DiamondDto FromEntity(Diamond d) => new(
        d.Id, d.Code, d.CertificateCode, d.Origin, d.Shape, d.Carat, d.Color, d.Clarity,
        d.Cut, d.Proportions, d.Polish, d.Symmetry, d.Fluorescence, d.Measurements, d.EstimatedPrice
    );
}

public record CreateDiamondRequest(
    string Code,
    string? CertificateCode,
    string Origin,
    string Shape,
    decimal Carat,
    string Color,
    string Clarity,
    string Cut,
    string Proportions,
    string Polish,
    string Symmetry,
    string Fluorescence,
    string Measurements
);
