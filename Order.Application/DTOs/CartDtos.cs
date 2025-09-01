namespace Order.Application.DTOs;

public record CartDto
{
    public int Id { get; init; }
    public string CartKey { get; init; } = default!;
    public int? CustomerId { get; init; }
    public IReadOnlyList<CartItemDto> Items { get; init; } = Array.Empty<CartItemDto>();
    public decimal Subtotal { get; init; }
    public decimal Discount { get; init; }
    public decimal ShippingFee { get; init; }
    public decimal Total { get; init; }
}
public record AddCartItemDto
{
    public required string Sku { get; set; }
    public required int Quantity { get; set; }
    public required decimal UnitPrice { get; set; }
    public string? Name { get; init; }
    public string? ImageUrl { get; init; }
}
public record UpdateCartItemDto(int CartItemId, int Quantity, decimal UnitPrice);
