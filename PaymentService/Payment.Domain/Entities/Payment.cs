using Payment.Domain.Enums;

namespace Payment.Domain.Entities;

public class Payment
{
    public int Id { get; set; }
    public string Method { get; set; } = default!;           // "FAKE"|"VNPay"|"Momo"|"Stripe"|...
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string OrderCode { get; set; } = default!;
    public string? ReturnUrl { get; set; }                   // FE muốn quay về đâu
    public string? ProviderReference { get; set; }           // mã giao dịch từ provider
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? FailureReason { get; set; }
    public string? IdempotencyKey { get; set; }              // để chống double-charge
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
