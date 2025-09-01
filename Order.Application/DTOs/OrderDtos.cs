﻿namespace Order.Application.DTOs;

public record CheckoutDto
{
    // Customer (session cart) sẽ gửi CartKey; non-customer thì để null
    public string? CartKey { get; init; }

    // Non-customer (Admin/Staff…) sẽ dùng CustomerId (userId); Customer thì để null
    public int? CustomerId { get; init; }

    public decimal ShippingFee { get; init; } = 0m;
    public string PaymentMethod { get; init; } = "COD";  // "COD" | "VNPay" | "Momo" | "Stripe"
    public string? Note { get; init; }
}
