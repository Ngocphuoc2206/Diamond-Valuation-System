using System;

namespace InvoiceService.Application.DTOs;

public record CreateReceiptRequest(
    string? ReceiptNo,
    DateOnly ReceiptDate,
    int AppraiserId,
    decimal EstimatedValue,
    DiamondDto Diamond,
    string? Notes
)
{
    public string? CustomerName { get;  set; }
    public string? CustomerEmail { get;  set; }
    public string? CustomerPhone { get;  set; }
    public string? CustomerAddress { get;  set; }
    public string? CustomerId { get;  set; }
    public Guid? CaseId { get;  set; }
}

public record DiamondDto(string ShapeCut, decimal CaratWeight, string? ColorGrade, string? ClarityGrade, string? CutGrade);
