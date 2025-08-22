namespace Order.Application.DTOs;

public record AddCartItemDto(string Sku, int Quantity, decimal UnitPrice);
public record UpdateCartItemDto(int CartItemId, int Quantity);
