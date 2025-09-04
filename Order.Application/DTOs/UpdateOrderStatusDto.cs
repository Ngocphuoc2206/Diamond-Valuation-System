using Order.Domain.Enums;

namespace Order.Application.DTOs
{
    public record UpdateOrderStatusDto(OrderStatus Status);
}
