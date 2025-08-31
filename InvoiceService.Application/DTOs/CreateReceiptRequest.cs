namespace InvoiceService.Application.DTOs;

public record CreateReceiptRequest(
    string? ReceiptNo,
    DateOnly ReceiptDate,
    Guid AppraiserId,
    decimal EstimatedValue,
    DiamondDto Diamond,
    string? Notes
);

public record DiamondDto(string ShapeCut, decimal CaratWeight, string? ColorGrade, string? ClarityGrade, string? CutGrade);
