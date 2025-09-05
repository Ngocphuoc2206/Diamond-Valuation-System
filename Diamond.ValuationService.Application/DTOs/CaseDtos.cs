using System.ComponentModel.DataAnnotations;

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

    public int? UserId { get; init; } // nếu có login

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
    public string Status { get; init; } = default!;
}
