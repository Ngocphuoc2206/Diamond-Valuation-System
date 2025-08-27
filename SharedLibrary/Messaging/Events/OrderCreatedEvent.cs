namespace SharedLibrary.Messaging.Events;

public record OrderCreatedEvent(
    string OrderNo,
    int? CustomerId,
    decimal Total,
    List<OrderItemDto> Items,
    string? IdempotencyKey
);

public record OrderItemDto(string Sku, int Quantity, decimal UnitPrice);
