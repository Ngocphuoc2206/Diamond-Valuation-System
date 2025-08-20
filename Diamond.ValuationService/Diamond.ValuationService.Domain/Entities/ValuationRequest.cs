namespace Diamond.ValuationService.Domain.Entities;

public class ValuationRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? CertificateNo { get; set; }
    public DiamondSpec Spec { get; set; } = new();
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    // NEW
    public string? CustomerName { get; set; }
}
