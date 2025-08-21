namespace Product.Domain.Entities;

public class Diamond
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!; // internal code
    public string? CertificateCode { get; set; } // external inspection code
    public string Origin { get; set; } = default!; // Natural / Lab-grown / Other
    public string Shape { get; set; } = default!; // Round, Princess, ...
    public decimal Carat { get; set; }
    public string Color { get; set; } = default!; // D..Z
    public string Clarity { get; set; } = default!; // IF..I3
    public string Cut { get; set; } = default!; // Excellent..Poor
    public string Proportions { get; set; } = default!; // text blob or JSON
    public string Polish { get; set; } = default!;
    public string Symmetry { get; set; } = default!;
    public string Fluorescence { get; set; } = default!;
    public string Measurements { get; set; } = default!; // e.g., "6.50 - 6.55 x 3.98 mm"
    public decimal? EstimatedPrice { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
