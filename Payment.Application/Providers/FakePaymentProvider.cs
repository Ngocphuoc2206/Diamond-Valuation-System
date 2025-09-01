using Microsoft.Extensions.Configuration;
using Payment.Domain.Services;

namespace Payment.Infrastructure.Providers;

public class FakePaymentProvider : IProvider
{
    private readonly string _apiBase;

    public FakePaymentProvider(IConfiguration config)
    {
        _apiBase =
            Environment.GetEnvironmentVariable("PUBLIC_API_URL") // ưu tiên env (docker-compose)
            ?? config["Payment:PublicBaseUrl"]                    // optional appsettings
            ?? "http://localhost:8081";                           // fallback cho Docker Cách B
    }

    public string Name => "FAKE";

    public Task<(string providerRef, string redirectUrl)> CreateAsync(
        Domain.Entities.Payment p,
        CancellationToken ct = default)
    {
        var providerRef = $"FAKE-{p.Id}-{Guid.NewGuid():N}".ToUpperInvariant();

        var redirectUrl =
            $"{_apiBase}/api/payments/fake/pay?pid={p.Id}" +
            $"&ref={Uri.EscapeDataString(providerRef)}" +
            $"&return={Uri.EscapeDataString(p.ReturnUrl ?? string.Empty)}";

        return Task.FromResult((providerRef, redirectUrl));
    }
}
