using Payment.Application.DTOs;
using SharedLibrary.Response;

namespace Payment.Domain.Services.Interfaces;

public interface IPaymentService
{
    Task<ApiResponse<PaymentViewDto>> CreateAsync(CreatePaymentDto dto, string idempotencyKey);
    Task<ApiResponse<PaymentViewDto>> GetAsync(int id);
    Task<ApiResponse<bool>> HandleFakeWebhookAsync(FakeWebhookDto dto, string rawBody);
    Task<ApiResponse<bool>> SimulateAsync(int id, string result, string? reason);
}
