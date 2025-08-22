using SharedLibrary.Response;
using Order.Application.DTOs;

namespace Order.Application.Services.Interfaces;

public interface IOrderService
{
    Task<ApiResponse<Order.Domain.Entities.Order>> CheckoutAsync(CheckoutDto dto);
    Task<ApiResponse<Order.Domain.Entities.Order>> GetAsync(string orderNo);
}
