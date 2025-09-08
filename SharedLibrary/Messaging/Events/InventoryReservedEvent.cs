namespace SharedLibrary.Messaging.Events;

public record InventoryReservedEvent(
    string OrderNo,
    bool Success,
    string? Reason
);
