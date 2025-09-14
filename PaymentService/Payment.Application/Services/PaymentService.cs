using Microsoft.Extensions.Logging;
using Payment.Application.DTOs;
using Payment.Application.Interfaces;
using Payment.Domain.Enums;
using Payment.Domain.Services;
using Payment.Domain.Services.Interfaces;
using SharedLibrary.Interfaces;
using SharedLibrary.Response;

namespace Payment.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IGenericRepository<Domain.Entities.Payment> _repo;
    private readonly IEnumerable<IProvider> _providers;
    private readonly ILogger<PaymentService> _logger;
    private readonly IOrderNotifier _notifier;

    public PaymentService(
        IGenericRepository<Domain.Entities.Payment> repo,
        IEnumerable<IProvider> providers,
        ILogger<PaymentService> logger,
        IOrderNotifier notifier)
    {
        _repo = repo;
        _providers = providers;
        _logger = logger;
        _notifier = notifier;
    }

    public async Task<ApiResponse<PaymentViewDto>> CreateAsync(CreatePaymentDto dto, string idempotencyKey)
    {
        var p = new Domain.Entities.Payment
        {
            Method = dto.Method,
            Amount = dto.Amount,
            Currency = dto.Currency,
            OrderCode = dto.OrderCode,
            ReturnUrl = dto.ReturnUrl,
            Status = PaymentStatus.Pending,
            IdempotencyKey = string.IsNullOrWhiteSpace(idempotencyKey) ? null : idempotencyKey,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(p);
        await _repo.SaveChangesAsync();

        var provider = _providers.FirstOrDefault(x => string.Equals(x.Name, p.Method, StringComparison.OrdinalIgnoreCase));
        if (provider is null)
        {
            p.Status = PaymentStatus.Failed;
            p.FailureReason = "Provider not found";
            await _repo.UpdateAsync(p);
            await _repo.SaveChangesAsync();
            return ApiResponse<PaymentViewDto>.Failure("Provider not found");
        }

        var (providerRef, redirectUrl) = await provider.CreateAsync(p);
        p.ProviderReference = providerRef;
        p.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(p);
        await _repo.SaveChangesAsync();

        return ApiResponse<PaymentViewDto>.CreateSuccessResponse(ToView(p, redirectUrl));
    }

    public async Task<ApiResponse<PaymentViewDto>> GetAsync(int id)
    {
        var p = await _repo.GetByIdAsync(id);
        if (p == null) return ApiResponse<PaymentViewDto>.Failure("Not found");
        return ApiResponse<PaymentViewDto>.CreateSuccessResponse(ToView(p, null));
    }

    public async Task<ApiResponse<PaymentViewDto>> SimulateAsync(int id, string result, string? reason)
    {
        var p = await _repo.GetByIdAsync(id);
        if (p == null) return ApiResponse<PaymentViewDto>.Failure("Not found");

        switch ((result ?? "").ToLowerInvariant())
        {
            case "success":
            case "succeeded":
            case "paid":
                p.Status = PaymentStatus.Succeeded;
                p.FailureReason = null;
                break;
            case "canceled":
            case "cancel":
                p.Status = PaymentStatus.Canceled;
                p.FailureReason = reason ?? "User canceled";
                break;
            default:
                p.Status = PaymentStatus.Failed;
                p.FailureReason = reason ?? "Simulated failure";
                break;
        }

        p.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(p);
        await _repo.SaveChangesAsync();

        return ApiResponse<PaymentViewDto>.CreateSuccessResponse(ToView(p, null));
    }

    public async Task<ApiResponse<bool>> HandleFakeWebhookAsync(FakeWebhookDto dto)
    {
        if (!string.Equals(dto.Provider, "FAKE", StringComparison.OrdinalIgnoreCase))
            return ApiResponse<bool>.Failure("Unsupported provider");

        var p = await _repo.FirstOrDefaultAsync(x => x.ProviderReference == dto.ProviderReference);
        if (p == null) return ApiResponse<bool>.Failure("Payment not found");

        switch (dto.Event)
        {
            case "payment.succeeded":
                p.Status = PaymentStatus.Succeeded; p.FailureReason = null; break;
            case "payment.canceled":
                p.Status = PaymentStatus.Canceled; p.FailureReason = "User canceled"; break;
            case "payment.failed":
                p.Status = PaymentStatus.Failed; p.FailureReason = "Gateway failed"; break;
            default:
                return ApiResponse<bool>.Failure("Unknown event");
        }

        p.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(p);
        await _repo.SaveChangesAsync();
        // gọi OrderService:
        try
        {
            await _notifier.NotifyAsync(p.OrderCode, p.Status.ToString().ToLowerInvariant(), p.ProviderReference);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to notify order status for {OrderCode}", p.OrderCode);
        }

        return ApiResponse<bool>.CreateSuccessResponse(true);
    }

    private static PaymentViewDto ToView(Domain.Entities.Payment p, string? redirect) => new()
    {
        Id = p.Id,
        Method = p.Method,
        Amount = p.Amount,
        Currency = p.Currency,
        OrderCode = p.OrderCode,
        Status = p.Status.ToString(),
        FailureReason = p.FailureReason,
        ProviderReference = p.ProviderReference,
        RedirectUrl = redirect
    };
}
