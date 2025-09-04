using Order.Domain.Enums;
namespace Order.Application.DTOs
{
    public record OrderDetailDto(
    string OrderNo,
    decimal TotalAmount,
    OrderStatus Status,
    DateTime? CreatedAt,
    IReadOnlyList<OrderItemDto> Items,
    string? Note = null,
    string? ShippingAddress = null,
    string? CustomerName = null,
    string? CustomerEmail = null,
    string? PaymentMethod = null
);
}
