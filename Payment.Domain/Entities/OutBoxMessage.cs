using SharedKernel.Entites;

namespace Payment.Domain.Entities;

public class OutboxMessage : BaseEntity
{
    public string EventType { get; set; } = string.Empty; // PaymentSucceeded, PaymentFailed...
    public string Payload { get; set; } = string.Empty;   // JSON
    public bool Published { get; set; } = false;
    public DateTime? PublishedAt { get; set; }
}
