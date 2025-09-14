using InvoiceService.Domain.Enums;
using InvoiceService.Domain.ValueObjects;
using System;

namespace InvoiceService.Domain.Entities;

public class Receipt
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ReceiptNo { get; private set; } = string.Empty; // RCP-2025-0123
    public DateOnly ReceiptDate { get; private set; }             // 2025-09-11

    // (tuỳ chọn) liên kết hồ sơ định giá để truy vết 1-1/1-n
    public Guid? CaseId { get; private set; }

    // Thông tin khách hàng (Bill To)
    public string? CustomerId { get; private set; }                 // nếu có user trong hệ thống
    public string? CustomerName { get; private set; }
    public string? CustomerEmail { get; private set; }
    public string? CustomerPhone { get; private set; }
    public string? CustomerAddress { get; private set; }

    // Nhân viên định giá & giá trị ước tính
    public int AppraiserId { get; private set; }
    public decimal EstimatedValue { get; private set; }

    public string? Notes { get; private set; }
    public ReceiptStatus Status { get; private set; } = ReceiptStatus.Issued;

    // Owned value object
    public DiamondInfo Diamond { get; private set; } = null!;

    private Receipt() { } // EF

    public Receipt(
        string receiptNo,
        DateOnly date,
        int appraiserId,
        decimal estimatedValue,
        DiamondInfo diamond,
        string? notes,

        string? customerName = null,
        string? customerEmail = null,
        string? customerPhone = null,
        string? customerAddress = null,
        string? customerId = null,
        Guid? caseId = null)
    {
        if (string.IsNullOrWhiteSpace(receiptNo)) throw new ArgumentException("ReceiptNo required");
        ReceiptNo = receiptNo;
        ReceiptDate = date;
        AppraiserId = appraiserId;
        EstimatedValue = decimal.Round(estimatedValue, 2);
        Diamond = diamond ?? throw new ArgumentNullException(nameof(diamond));
        Notes = notes;
        Status = ReceiptStatus.Issued;

        // gán thông tin khách
        CustomerId = customerId;
        CustomerName = customerName;
        CustomerEmail = customerEmail;
        CustomerPhone = customerPhone;
        CustomerAddress = customerAddress;
        CaseId = caseId;
    }

    public void Update(decimal? estimatedValue = null, DiamondInfo? diamond = null, string? notes = null)
    {
        if (Status == ReceiptStatus.Cancelled) throw new InvalidOperationException("Receipt cancelled");
        if (estimatedValue.HasValue) EstimatedValue = decimal.Round(estimatedValue.Value, 2);
        if (diamond is not null) Diamond = diamond;
        Notes = notes ?? Notes;
    }

    public void UpdateCustomer(string? name = null, string? email = null, string? phone = null, string? address = null, string? customerId = null)
    {
        if (Status == ReceiptStatus.Cancelled) throw new InvalidOperationException("Receipt cancelled");
        CustomerName = name ?? CustomerName;
        CustomerEmail = email ?? CustomerEmail;
        CustomerPhone = phone ?? CustomerPhone;
        CustomerAddress = address ?? CustomerAddress;
        CustomerId = customerId ?? CustomerId;
    }

    public void LinkCase(Guid caseId) => CaseId = caseId;

    public void Cancel() { Status = ReceiptStatus.Cancelled; }
}
