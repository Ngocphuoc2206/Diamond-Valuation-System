using Order.Domain.Enums;

namespace Order.Application.DTOs
{
    public record OrderSummaryDto(
    string OrderNo,
    int? CustomerId,
    decimal TotalAmount,
    OrderStatus Status,
    DateTime? CreatedAt,
    string? CustomerName = null,
    string? CustomerEmail = null,
    string? PaymentMethod = null
);
}
