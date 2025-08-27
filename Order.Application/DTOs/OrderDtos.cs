namespace Order.Application.DTOs;

public record CheckoutDto
{
    public required string CartKey { get; init; }
    public int? CustomerId { get; init; }
    public decimal ShippingFee { get; init; } = 0m;
    public string PaymentMethod { get; init; } = "COD";  // "COD" | "VNPay" | "Momo" | "Stripe"
    public string? Note { get; init; }
}
