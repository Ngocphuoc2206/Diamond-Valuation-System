namespace Payment.Application.DTOs;

public record CreatePaymentDto(string OrderNo, decimal Amount, string Method); // Method="FAKE"
public record PaymentViewDto(int Id, string OrderNo, string Provider, decimal Amount, string Status, string? ExternalRef);
public record FakeWebhookDto(int PaymentId, string Status, string? ExtRef, string? Reason);
public record RefundDto(int PaymentId, decimal Amount, string? Reason);
