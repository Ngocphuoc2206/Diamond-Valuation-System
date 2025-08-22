using System.ComponentModel.DataAnnotations;

namespace Diamond.ValuationService.Application.DTOs;

/// <summary>Yêu cầu tạo hồ sơ định giá (bao gồm thông tin liên hệ + thông số kim cương)</summary>
public record class CreateCaseRequestDto
{
    // ===== Thông tin liên hệ =====
    [Required, StringLength(200)]
    public string FullName { get; init; } = default!;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; init; } = default!;

    [Required, Phone, StringLength(30)]
    public string Phone { get; init; } = default!;

    /// <summary>Email | Phone | Zalo | SMS ...</summary>
    [Required, StringLength(50)]
    public string PreferredContactMethod { get; init; } = default!;

    // ===== Thông tin kim cương =====

    /// <summary>Số chứng chỉ (nếu có)</summary>
    [StringLength(100)]
    public string? CertificateNo { get; init; }

    /// <summary>Natural | Lab-grown (hoặc giá trị doanh nghiệp của bạn)</summary>
    [Required, StringLength(50)]
    public string Origin { get; init; } = default!;

    /// <summary>Round | Princess | Oval ...</summary>
    [Required, StringLength(50)]
    public string Shape { get; init; } = default!;

    /// <summary>Trọng lượng (ct). Ví dụ 1.25</summary>
    [Range(0.001, 1000)]
    public decimal Carat { get; init; }

    /// <summary>D, E, F, ...</summary>
    [Required, StringLength(10)]
    public string Color { get; init; } = default!;

    /// <summary>IF, VVS1, VVS2, VS1, VS2, ...</summary>
    [Required, StringLength(10)]
    public string Clarity { get; init; } = default!;

    /// <summary>Excellent | Very Good | Good ...</summary>
    [Required, StringLength(20)]
    public string Cut { get; init; } = default!;

    [Required, StringLength(20)]
    public string Polish { get; init; } = default!;

    [Required, StringLength(20)]
    public string Symmetry { get; init; } = default!;

    /// <summary>None | Faint | Medium | Strong ...</summary>
    [Required, StringLength(20)]
    public string Fluorescence { get; init; } = default!;
}

/// <summary>Kết quả tạo hồ sơ</summary>
public readonly record struct CreateCaseResponseDto(
    Guid CaseId,
    string Status
);

/// <summary>Yêu cầu cập nhật trạng thái hồ sơ</summary>
public record class UpdateCaseStatusDto
{
    /// <summary>Trạng thái mới (ví dụ: New, Submitted, InReview, Priced, Completed, Canceled)</summary>
    [Required, StringLength(50)]
    public string Status { get; init; } = default!;
}
