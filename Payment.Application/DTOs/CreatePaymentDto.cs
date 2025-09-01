namespace Payment.Application.DTOs;

public record CreatePaymentDto
{
    public string Method { get; init; } = default!;
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "USD";
    public string OrderCode { get; init; } = default!;
    public string? ReturnUrl { get; init; }           // FE truyền vào
}
