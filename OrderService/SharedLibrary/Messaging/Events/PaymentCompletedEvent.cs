namespace SharedLibrary.Messaging.Events;

public record PaymentCompletedEvent(
    string OrderNo,
    string PaymentId,
    string Status,     // "Succeeded" | "Failed"
    decimal PaidAmount
);
