using Payment.Application.DTOs;
using Payment.Domain.Entities;
using Payment.Domain.Interfaces;
using Payment.Domain.Providers;
using Payment.Domain.Services.Interfaces;
using SharedLibrary.Response;

namespace Payment.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _uow;
    private readonly IEnumerable<IPaymentProvider> _providers;
    private readonly IHttpClientFactory _http; // để gọi OrderService xác thực amount (tuỳ bạn dùng)

    public PaymentService(IUnitOfWork uow, IEnumerable<IPaymentProvider> providers, IHttpClientFactory httpClientFactory)
    {
        _uow = uow;
        _providers = providers;
        _http = httpClientFactory;
    }

    public async Task<ApiResponse<PaymentViewDto>> CreateAsync(CreatePaymentDto dto, string idempotencyKey)
    {
        if (string.IsNullOrWhiteSpace(idempotencyKey))
            return ApiResponse<PaymentViewDto>.Failure("Missing Idempotency-Key");

        // gọi OrderService để check OrderNo + Amount khớp
        // validate với OrderService

        var existing = (await _uow.Payments.GetManyAsync(x => x.OrderNo == dto.OrderNo &&
                                                              (x.Status == PaymentStatus.Processing || x.Status == PaymentStatus.Succeeded)))
                                                              .OrderByDescending(x => x.Id)
                                                              .FirstOrDefault();
        if (existing is not null && existing.IdempotencyKey == idempotencyKey)
        {
            return ApiResponse<PaymentViewDto>.CreateSuccessResponse(ToView(existing), "Idempotent return");
        }
        if (existing is not null && existing.Status == PaymentStatus.Succeeded)
        {
            return ApiResponse<PaymentViewDto>.Failure("Order already paid");
        }

        var provider = _providers.FirstOrDefault(p => p.Name.Equals(dto.Method, StringComparison.OrdinalIgnoreCase));
        if (provider is null) return ApiResponse<PaymentViewDto>.Failure("Unsupported provider");

        var p = new Payment.Domain.Entities.Payment
        {
            OrderNo = dto.OrderNo.Trim(),
            Amount = dto.Amount,
            Provider = provider.Name,
            Status = PaymentStatus.Processing,
            IdempotencyKey = idempotencyKey
        };
        await _uow.Payments.CreateAsync(p);

        // sau khi có Id, tạo redirectUrl + externalRef
        var (redirectUrl, extRef) = await provider.CreateAsync(p);
        p.ExternalRef = extRef;
        await _uow.Payments.UpdateAsync(p);

        // (tuỳ chọn) ghi outbox PaymentInitiated

        return ApiResponse<PaymentViewDto>.CreateSuccessResponse(ToView(p), redirectUrl);
    }

    public async Task<ApiResponse<PaymentViewDto>> GetAsync(int id)
    {
        var p = await _uow.Payments.GetByIdAsync(id);
        if (p is null) return ApiResponse<PaymentViewDto>.Failure("Not found");
        return ApiResponse<PaymentViewDto>.CreateSuccessResponse(ToView(p), "Ok");
    }

    public async Task<ApiResponse<bool>> HandleFakeWebhookAsync(FakeWebhookDto dto, string rawBody)
    {
        var p = await _uow.Payments.GetByIdAsync(dto.PaymentId);
        if (p is null) return ApiResponse<bool>.Failure("Payment not found");
        if (p.Status is PaymentStatus.Succeeded or PaymentStatus.Failed)
            return ApiResponse<bool>.CreateSuccessResponse(true, "Already finalized");

        // mock verify
        var provider = _providers.First(x => x.Name == "FAKE");
        provider.VerifyWebhookAsync(rawBody, out _, out var extRef, out var reason);

        if (dto.Status.Equals("Succeeded", StringComparison.OrdinalIgnoreCase))
        {
            p.Status = PaymentStatus.Succeeded;
            p.ExternalRef = dto.ExtRef ?? extRef;
            p.RawPayload = rawBody;
            await _uow.Payments.UpdateAsync(p);

            // outbox: PaymentSucceeded { orderNo, paymentId, amount }
            await _uow.Outbox.CreateAsync(new OutboxMessage
            {
                EventType = "PaymentSucceeded",
                Payload = System.Text.Json.JsonSerializer.Serialize(new { p.Id, p.OrderNo, p.Amount, p.Provider })
            });
            return ApiResponse<bool>.CreateSuccessResponse(true, "OK");
        }
        else
        {
            p.Status = PaymentStatus.Failed;
            p.RawPayload = rawBody;
            await _uow.Payments.UpdateAsync(p);

            await _uow.Outbox.CreateAsync(new OutboxMessage
            {
                EventType = "PaymentFailed",
                Payload = System.Text.Json.JsonSerializer.Serialize(new { p.Id, p.OrderNo, Reason = dto.Reason })
            });
            return ApiResponse<bool>.CreateSuccessResponse(true, "Failed");
        }
    }

    public async Task<ApiResponse<bool>> SimulateAsync(int id, string result, string? reason)
    {
        var p = await _uow.Payments.GetByIdAsync(id);
        if (p is null) return ApiResponse<bool>.Failure("Payment not found");
        if (p.Status is PaymentStatus.Succeeded or PaymentStatus.Failed)
            return ApiResponse<bool>.CreateSuccessResponse(true, "Already finalized");

        if (string.Equals(result, "success", StringComparison.OrdinalIgnoreCase))
        {
            p.Status = PaymentStatus.Succeeded;
            p.ExternalRef = p.ExternalRef ?? $"FAKE-{Guid.NewGuid():N}";
            await _uow.Payments.UpdateAsync(p);
            await _uow.Outbox.CreateAsync(new OutboxMessage
            {
                EventType = "PaymentSucceeded",
                Payload = System.Text.Json.JsonSerializer.Serialize(new { p.Id, p.OrderNo, p.Amount, p.Provider })
            });
            return ApiResponse<bool>.CreateSuccessResponse(true, "OK");
        }
        else
        {
            p.Status = PaymentStatus.Failed;
            await _uow.Payments.UpdateAsync(p);
            await _uow.Outbox.CreateAsync(new OutboxMessage
            {
                EventType = "PaymentFailed",
                Payload = System.Text.Json.JsonSerializer.Serialize(new { p.Id, p.OrderNo, Reason = reason })
            });
            return ApiResponse<bool>.CreateSuccessResponse(true, "Failed");
        }
    }

    private static PaymentViewDto ToView(Payment.Domain.Entities.Payment p)
        => new(p.Id, p.OrderNo, p.Provider, p.Amount, p.Status.ToString(), p.ExternalRef);
}
