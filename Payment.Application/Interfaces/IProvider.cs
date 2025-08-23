using Payment.Domain.Entities;

namespace Payment.Domain.Providers;

public interface IPaymentProvider
{
    string Name { get; } // "FAKE"
    Task<(string redirectUrl, string externalRef)> CreateAsync(Payment.Domain.Entities.Payment p);
    Task<bool> VerifyWebhookAsync(string rawBody, out string status, out string? extRef, out string? reason);
}
