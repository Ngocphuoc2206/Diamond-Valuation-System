using SharedKernel.Entites;

namespace Payment.Domain.Entities;

public enum PaymentStatus { Processing, Succeeded, Failed, Refunded }

public class Payment : BaseEntity
{
    public string OrderNo { get; set; } = string.Empty;
    public string Provider { get; set; } = "FAKE";
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Processing;

    // Thông tin bên ngoài
    public string? ExternalRef { get; set; }     // mã giao dịch provider
    public string? RawPayload { get; set; }      // json webhook

    // Idempotency
    public string IdempotencyKey { get; set; } = string.Empty;
}
