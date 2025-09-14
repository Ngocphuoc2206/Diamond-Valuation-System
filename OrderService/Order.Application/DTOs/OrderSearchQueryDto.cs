using Order.Domain.Enums;


namespace Order.Application.DTOs
{
    public record OrderSearchQueryDto(
        string? Q,
        OrderStatus? Status,
        DateTime? DateFrom,
        DateTime? DateTo,
        int Page = 1,
        int PageSize = 20
    );
}
