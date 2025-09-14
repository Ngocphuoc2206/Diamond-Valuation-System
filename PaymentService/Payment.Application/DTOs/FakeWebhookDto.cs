namespace Payment.Application.DTOs;

public record FakeWebhookDto
{
    public string Provider { get; init; } = "FAKE";
    public string? ProviderReference { get; init; }
    public string Event { get; init; } = "payment.succeeded"; // failed/canceled/…
}
