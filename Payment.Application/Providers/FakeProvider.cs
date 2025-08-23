using Payment.Domain.Providers;

namespace Payment.Application.Providers;

public class FakeProvider : IPaymentProvider
{
    public string Name => "FAKE";

    public Task<(string redirectUrl, string externalRef)> CreateAsync(Payment.Domain.Entities.Payment p)
    {
        // redirectUrl trỏ đến endpoint sandbox/local
        var ext = $"FAKE-{Guid.NewGuid():N}";
        var url = $"/fake/checkout?paymentId={p.Id}";
        return Task.FromResult((url, ext));
    }

    public Task<bool> VerifyWebhookAsync(string rawBody, out string status, out string? extRef, out string? reason)
    {
        // Ở mock, không ký số — đọc JSON đơn giản là đủ
        status = "Succeeded"; extRef = "FAKE-WEBHOOK"; reason = null;
        return Task.FromResult(true);
    }
}
