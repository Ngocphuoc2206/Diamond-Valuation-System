namespace Product.Application.DTOs;

public record EstimateByCriteriaRequest(
    string Origin,
    string Shape,
    string Measurements,
    decimal Carat,
    string Color,
    string Clarity,
    string Cut,
    string Proportions,
    string Polish,
    string Symmetry,
    string Fluorescence
);

public record EstimateResponse(
    decimal EstimatedPrice,
    string Currency,
    string Method,
    IDictionary<string, decimal> ScoreBreakdown
);

public record EstimateByCertificateRequest(string CertificateCode);
