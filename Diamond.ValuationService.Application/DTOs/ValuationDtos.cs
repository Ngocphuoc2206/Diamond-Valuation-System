namespace Diamond.ValuationService.Application.DTOs;

public class EstimateRequestDto
{
    public string? CertificateNo { get; set; }
    public string Origin { get; set; } = "Natural";
    public string Shape { get; set; } = "Round";
    public decimal Carat { get; set; }
    public string Color { get; set; } = "G";
    public string Clarity { get; set; } = "VS1";
    public string Cut { get; set; } = "Excellent";
    public string Polish { get; set; } = "Excellent";
    public string Symmetry { get; set; } = "Excellent";
    public string Fluorescence { get; set; } = "None";
    public decimal TablePercent { get; set; }
    public decimal DepthPercent { get; set; }
    public string? Measurements { get; set; }

    // NEW: cho phép gán RequestId do Request Service tạo
    public Guid? ExternalRequestId { get; set; }
    public string? CustomerName { get; set; }
}

public class EstimateResponseDto
{
    public Guid RequestId { get; set; }
    public Guid ResultId { get; set; }
    public decimal PricePerCarat { get; set; }
    public decimal TotalPrice { get; set; }
    public string Currency { get; set; } = "USD";
    public string AlgorithmVersion { get; set; } = "1.0.0";
    public DateTime ValuatedAt { get; set; }
}
