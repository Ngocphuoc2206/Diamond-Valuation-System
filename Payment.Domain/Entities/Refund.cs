using SharedKernel.Entites;

namespace Payment.Domain.Entities;

public class Refund : BaseEntity
{
    public int PaymentId { get; set; }
    public Payment Payment { get; set; } = default!;
    public decimal Amount { get; set; }
    public string? Reason { get; set; }
}
