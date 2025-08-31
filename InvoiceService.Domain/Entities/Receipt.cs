using InvoiceService.Domain.Enums;
using InvoiceService.Domain.ValueObjects;

namespace InvoiceService.Domain.Entities;

public class Receipt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ReceiptNo { get; private set; } = string.Empty;         // RCP-2024-0124
    public DateOnly ReceiptDate { get; private set; }                     // 2025-08-27
    public Guid? CustomerId { get; private set; }
    public Guid AppraiserId { get; private set; }                         // Valuation staff
    public decimal EstimatedValue { get; private set; }                   // 8500.00
    public string? Notes { get; private set; }
    public ReceiptStatus Status { get; private set; } = ReceiptStatus.Issued;

    // Owned
    public DiamondInfo Diamond { get; private set; } = null!;

    private Receipt() { } // EF
    public Receipt(string receiptNo, DateOnly date, Guid appraiserId, decimal estimatedValue, DiamondInfo diamond, string? notes)
    {
        if (string.IsNullOrWhiteSpace(receiptNo)) throw new ArgumentException("ReceiptNo required");
        ReceiptNo = receiptNo;
        ReceiptDate = date;
        AppraiserId = appraiserId;
        EstimatedValue = decimal.Round(estimatedValue, 2);
        Diamond = diamond ?? throw new ArgumentNullException(nameof(diamond));
        Notes = notes;
        Status = ReceiptStatus.Issued;
    }

    public void Update(decimal? estimatedValue = null, DiamondInfo? diamond = null, string? notes = null)
    {
        if (Status == ReceiptStatus.Cancelled) throw new InvalidOperationException("Receipt cancelled");
        if (estimatedValue.HasValue) EstimatedValue = decimal.Round(estimatedValue.Value, 2);
        if (diamond is not null) Diamond = diamond;
        Notes = notes ?? Notes;
    }

    public void Cancel() { Status = ReceiptStatus.Cancelled; }
}
