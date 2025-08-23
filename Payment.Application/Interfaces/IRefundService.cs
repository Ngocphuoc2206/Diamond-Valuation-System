using SharedLibrary.Response;
using Payment.Application.DTOs;

namespace Payment.Application.Services.Interfaces;

public interface IRefundService
{
    Task<ApiResponse<bool>> CreateRefundAsync(RefundDto dto);
}
