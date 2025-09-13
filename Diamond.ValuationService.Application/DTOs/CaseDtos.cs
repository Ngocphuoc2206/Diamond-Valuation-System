using Diamond.ValuationService.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Diamond.ValuationService.Application.DTOs;

public record class CreateCaseRequestDto
{
    // ===== Liên hệ =====
    [Required, StringLength(200)]
    public string FullName { get; init; } = default!;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; init; } = default!;

    [Required, StringLength(30)]
    public string Phone { get; init; } = default!;

    [StringLength(50)]
    public string PreferredMethod { get; init; } = "Email";

    public int? UserId { get; set; } // nếu có login

    // ===== Kim cương =====
    public string? CertificateNo { get; init; }

    [Required] public string Origin { get; init; } = "Natural";
    [Required] public string Shape { get; init; } = "Round";
    [Range(0.01, 100)] public decimal Carat { get; init; }

    [Required] public string Color { get; init; } = "G";
    [Required] public string Clarity { get; init; } = "VS1";
    [Required] public string Cut { get; init; } = "Excellent";

    public string Polish { get; init; } = "Excellent";
    public string Symmetry { get; init; } = "Excellent";
    public string Fluorescence { get; init; } = "None";

    public decimal TablePercent { get; init; }
    public decimal DepthPercent { get; init; }
    public string? Measurements { get; init; } // "6.45-6.49x3.95mm"

    // Link với estimate đã chạy trước (nếu có)
    public Guid? ExistingRequestId { get; init; }

    // Ghi chú thêm
    public string? Notes { get; init; }
}

/// <summary>Kết quả tạo hồ sơ</summary>
public readonly record struct CreateCaseResponseDto(
    Guid CaseId,
    string Status
);

public record class UpdateCaseStatusDto
{
    [Required, StringLength(50)]
    public string Status { get; set; } = default!;
}

public record CaseListItemDto(
    Guid Id,
    string Status,
    int Progress,
    [property: JsonPropertyName("assigneeName")] string? ConsultantName,
    string? ValuationName,
    decimal? EstimatedValue,
    DateTime CreatedAt,
    MiniContactDto? Contact,
    MiniDiamondDto? Diamond
);

public class CaseDetailDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = default!;
    public int Progress { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public DiamondInfoDto Diamond { get; set; } = new();
    public ContactDto Contact { get; set; } = new();
    [JsonPropertyName("assigneeName")]
    public string? ConsultantName { get; set; }
    public string? ValuationName { get; set; }
    public decimal? EstimatedValue { get; set; }
    public decimal? MarketValue { get; set; }
    public decimal? InsuranceValue { get; set; }
}