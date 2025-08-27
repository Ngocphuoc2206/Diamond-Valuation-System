namespace Diamond.ValuationService.Domain.Entities;

public class ValuationCase
{
    public Guid Id { get; set; }

    // Thông tin kim cương
    public string? CertificateNo { get; set; }
    public string Origin { get; set; } = null!;
    public string Shape { get; set; } = null!;
    public decimal Carat { get; set; }
    public string Color { get; set; } = null!;
    public string Clarity { get; set; } = null!;
    public string Cut { get; set; } = null!;
    public string Polish { get; set; } = null!;
    public string Symmetry { get; set; } = null!;
    public string Fluorescence { get; set; } = null!;

    // Quy trình
    public CaseStatus Status { get; set; } = CaseStatus.YeuCau;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Liên hệ
    public Guid ContactId { get; set; }
    public Contact Contact { get; set; } = null!;
}   
