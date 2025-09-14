using InvoiceService.Domain.Enums;
using System;

namespace InvoiceService.Application.DTOs;

public class ReceiptResponse
{
    public Guid Id { get; set; }
    public string ReceiptNo { get; set; } = default!;
    public string ReceiptDate { get; set; } = default!; // hoặc DateOnly
    public decimal EstimatedValue { get; set; }
    public DiamondDto Diamond { get; set; } = default!;
    public string? Notes { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerAddress { get; set; }
}

