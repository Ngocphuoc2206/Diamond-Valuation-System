namespace Product.Domain.Entities;

public class Certificate
{
    public Guid Id { get; set; }
    public string CertificateCode { get; set; } = default!; // company-issued code
    public string CustomerName { get; set; } = default!;
    public Guid DiamondId { get; set; }
    public string Status { get; set; } = "Active"; // Active/Revoked/etc.
}
