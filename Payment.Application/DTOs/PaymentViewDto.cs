namespace Payment.Application.DTOs;

public record PaymentViewDto
{
    public int Id { get; init; }
    public string Method { get; init; } = default!;
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "USD";
    public string OrderCode { get; init; } = default!;
    public string Status { get; init; } = default!;
    public string? FailureReason { get; init; }
    public string? ProviderReference { get; init; }
    public string? RedirectUrl { get; init; }         // ⭐ phải có để FE redirect
}
