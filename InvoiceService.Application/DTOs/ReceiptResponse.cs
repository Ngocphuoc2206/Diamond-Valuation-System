using InvoiceService.Domain.Enums;

namespace InvoiceService.Application.DTOs;

public record ReceiptResponse(
    Guid Id,
    string ReceiptNo,
    DateOnly ReceiptDate,
    Guid AppraiserId,
    decimal EstimatedValue,
    ReceiptStatus Status,
    DiamondDto Diamond,
    string? Notes
);
