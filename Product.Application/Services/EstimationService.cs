using Product.Application.DTOs;
using Product.Application.Interfaces;

namespace Product.Application.Services;

public interface IEstimationService
{
    Task<EstimateResponse> EstimateByCriteriaAsync(EstimateByCriteriaRequest req, CancellationToken ct);
    Task<EstimateResponse> EstimateByCertificateAsync(EstimateByCertificateRequest req, CancellationToken ct);
}

public class EstimationService : IEstimationService
{
    private readonly IDiamondRepository _repo;

    public EstimationService(IDiamondRepository repo)
    {
        _repo = repo;
    }

    public Task<EstimateResponse> EstimateByCertificateAsync(EstimateByCertificateRequest req, CancellationToken ct)
        => EstimateByCriteriaAsync(new EstimateByCriteriaRequest(
            Origin: "Unknown",
            Shape: "Round",
            Measurements: "0x0x0",
            Carat: 1.0m,
            Color: "G",
            Clarity: "VS2",
            Cut: "Excellent",
            Proportions: "NA",
            Polish: "Excellent",
            Symmetry: "Excellent",
            Fluorescence: "None"
        ), ct);

    public Task<EstimateResponse> EstimateByCriteriaAsync(EstimateByCriteriaRequest req, CancellationToken ct)
    {
        // Simple baseline estimation model (placeholder). Replace with real price tables later.
        // Start with a base per-carat value
        decimal basePerCarat = 3000m;

        // Adjustments
        var factors = new Dictionary<string, decimal>();

        decimal shapeFactor = req.Shape.ToLower() == "round" ? 1.05m : 1.00m;
        factors["shape"] = shapeFactor;

        decimal colorFactor = req.Color.ToUpper() switch {
            "D" => 1.30m, "E" => 1.25m, "F" => 1.20m, "G" => 1.15m, "H" => 1.10m, "I" => 1.05m,
            _ => 1.00m
        };
        factors["color"] = colorFactor;

        decimal clarityFactor = req.Clarity.ToUpper() switch {
            "IF" => 1.35m, "VVS1" => 1.30m, "VVS2" => 1.25m, "VS1" => 1.20m, "VS2" => 1.15m,
            "SI1" => 1.05m, "SI2" => 0.98m, _ => 0.95m
        };
        factors["clarity"] = clarityFactor;

        decimal cutFactor = req.Cut.ToLower() switch {
            "excellent" => 1.20m, "very good" => 1.10m, "good" => 1.00m, "fair" => 0.92m, _ => 0.88m
        };
        factors["cut"] = cutFactor;

        decimal polishFactor = req.Polish.ToLower() == "excellent" ? 1.05m : 1.00m;
        factors["polish"] = polishFactor;

        decimal symmetryFactor = req.Symmetry.ToLower() == "excellent" ? 1.05m : 1.00m;
        factors["symmetry"] = symmetryFactor;

        decimal fluorescenceFactor = req.Fluorescence.ToLower() switch {
            "none" => 1.00m, "faint" => 0.99m, "medium" => 0.96m, "strong" => 0.92m, _ => 0.95m
        };
        factors["fluorescence"] = fluorescenceFactor;

        decimal totalFactor = factors.Values.Aggregate(1.0m, (acc, f) => acc * f);
        decimal price = basePerCarat * req.Carat * totalFactor;

        var response = new EstimateResponse(
            EstimatedPrice: Math.Round(price, 2),
            Currency: "USD",
            Method: "RuleBased-v1",
            ScoreBreakdown: factors
        );
        return Task.FromResult(response);
    }
}
