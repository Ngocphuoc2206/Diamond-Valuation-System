using Payment.Domain.Entities;

namespace Payment.Domain.Services;

public interface IProvider
{
    string Name { get; } // "FAKE", "VNPay", ...
    Task<(string providerRef, string redirectUrl)> CreateAsync(Payment.Domain.Entities.Payment p, CancellationToken ct = default);
}
