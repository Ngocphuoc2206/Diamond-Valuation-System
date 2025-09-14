using SharedLibrary.Response;
using Order.Application.DTOs;
using Order.Domain.Enums;
using System;

namespace Order.Application.Services.Interfaces;

public interface IOrderService
{
    Task<ApiResponse<Order.Domain.Entities.Order>> CheckoutAsync(CheckoutDto dto);
    Task<ApiResponse<OrderDetailDto>> GetAsync(string orderNo);

    Task<ApiResponse<PagedResult<OrderSummaryDto>>> SearchAsync(OrderSearchQueryDto q);
    Task<ApiResponse<bool>> UpdateStatusAsync(string orderNo, OrderStatus status);

    Task<ApiResponse<List<OrderBriefDto>>> GetRecentMineAsync(int customerId, int take);
    Task<ApiResponse<MyOrderSummaryDto>> GetMySummaryAsync(int customerId);
}
