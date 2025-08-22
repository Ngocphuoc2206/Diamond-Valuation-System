namespace Order.Application.DTOs;

public record CheckoutDto(string CartKey, int? CustomerId, decimal ShippingFee);
