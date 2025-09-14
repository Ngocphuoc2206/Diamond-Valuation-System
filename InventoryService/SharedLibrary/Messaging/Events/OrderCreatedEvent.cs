namespace SharedLibrary.Messaging.Events;

public record OrderCreatedEvent(
    string OrderNo,
    int? CustomerId,
    decimal Total,
    List<OrderItemDto> Items
);

public record OrderItemDto(string Sku, int Quantity, decimal UnitPrice);
