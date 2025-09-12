using System.Text.Json.Serialization;

namespace Diamond.ValuationService.Domain.Entities;

public class ValuationCase
{
    public Guid Id { get; set; }

    // ===== Thông tin kim cương =====
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

    // ===== Quy trình =====
    public CaseStatus Status { get; set; } = CaseStatus.YeuCau;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // ===== Liên hệ =====
    public Guid ContactId { get; set; }
    [JsonIgnore]
    public Contact Contact { get; set; } = null!;      
    public int? UserId { get; set; }                                 
    public Guid? RequestId { get; set; }
    [JsonIgnore]
    public ValuationRequest? Request { get; set; }

    // ===== Staff phụ trách =====
    public int? AssigneeId { get; set; }
    public string? AssigneeName { get; set; }

    // ===== Valuationer phụ trách ======
    public int? ValuationId { get; set; }
    public string? ValuationName { get; set; }

    [JsonIgnore]
    public ValuationResult? Result { get; set; }
    public decimal? EstimatedValue { get; set; }

    public ICollection<ContactLog> ContactLogs { get; set; } = new List<ContactLog>();

}
