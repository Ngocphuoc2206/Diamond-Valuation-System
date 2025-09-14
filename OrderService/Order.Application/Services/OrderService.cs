using Microsoft.EntityFrameworkCore;
using Order.Application.DTOs;
using Order.Application.Interfaces;
using Order.Application.Services.Interfaces;
using Order.Domain.Enums;
using SharedLibrary.Response;
using System.Linq;

namespace Order.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _uow;
    public OrderService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<ApiResponse<Order.Domain.Entities.Order>> CheckoutAsync(CheckoutDto dto)
    {
        // Resolve cart theo ưu tiên:
        // 1. Có CartKey => lấy theo CartKey (Customer)
        // 2. Không có CartKey nhưng có CustomerId => lấy theo CustomerId (non-customer)
        // 3. Không có cả hai => lỗi
        Order.Domain.Entities.Cart? cart = null;

        if (!string.IsNullOrWhiteSpace(dto.CartKey))
        {
            cart = await _uow.Carts.GetByAsync(c => c.CartKey == dto.CartKey);
        }
        else if (dto.CustomerId.HasValue)
        {
            cart = await _uow.Carts.GetByAsync(c => c.CustomerId == dto.CustomerId.Value);
        }

        if (cart is null)
            return ApiResponse<Order.Domain.Entities.Order>.Failure("Cart not found");

        var items = await _uow.CartItems.GetManyAsync(ci => ci.CartId == cart.Id);
        if (!items.Any())
            return ApiResponse<Order.Domain.Entities.Order>.Failure("Cart empty");

        var subtotal = items.Sum(i => i.UnitPrice * i.Quantity);
        var shipping = 0m;

        var order = new Order.Domain.Entities.Order
        {
            OrderNo = $"OD{DateTime.UtcNow:yyyyMMddHHmmss}{cart.Id}",
            // Ưu tiên CustomerId từ cart nếu có; fallback dto.CustomerId:
            CustomerId = cart.CustomerId ?? dto.CustomerId,
            Subtotal = subtotal,
            Discount = 0,
            ShippingFee = shipping,
            Total = subtotal + shipping,
            Status = OrderStatus.Pending, // trạng thái khởi tạo
            CreatedAt = DateTime.UtcNow,
            Items = items.Select(i => new Order.Domain.Entities.OrderItem
            {
                Sku = i.Sku,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.UnitPrice * i.Quantity,
                Name = i.Name,
                ImageUrl = i.ImageUrl
            }).ToList()
        };

        await _uow.Orders.CreateAsync(order);

        foreach (var it in items)
            await _uow.CartItems.DeleteAsync(it);
        await _uow.Carts.UpdateAsync(cart);
        await _uow.SaveChangesAsync();

        return ApiResponse<Order.Domain.Entities.Order>.CreateSuccessResponse(order, "Order placed");
    }

    public async Task<ApiResponse<OrderDetailDto>> GetAsync(string orderNo)
    {
        var o = await _uow.Orders.GetByAsync(x => x.OrderNo == orderNo);
        if (o is null)
            return ApiResponse<OrderDetailDto>.Failure("Order not found");

        var items = await _uow.OrderItems.GetManyAsync(oi => oi.OrderId == o.Id);
        o.Items = items.ToList();

        var dto = new OrderDetailDto(
            o.OrderNo,
            o.Total,
            o.Status,
            o.CreatedAt,
            o.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                Sku = i.Sku,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.LineTotal,
                Name = i.Name,
                ImageUrl = i.ImageUrl
            }).ToList(),
            // Note, ShippingAddress, CustomerName, CustomerEmail, PaymentMethod
            null, null, null, null, null
        );
        return ApiResponse<OrderDetailDto>.CreateSuccessResponse(dto, "Ok");
    }

    public async Task<ApiResponse<PagedResult<OrderSummaryDto>>> SearchAsync(OrderSearchQueryDto q)
    {
        // Lấy tất cả đơn hàng từ DB
        var all = await _uow.Orders.GetManyAsync(_ => true);

        // Lọc trên bộ nhớ
        IEnumerable<Order.Domain.Entities.Order> filtered = all;

        if (!string.IsNullOrWhiteSpace(q.Q))
            filtered = filtered.Where(o => (o.OrderNo ?? string.Empty).Contains(q.Q, StringComparison.OrdinalIgnoreCase));

        if (q.Status.HasValue)
            filtered = filtered.Where(o => o.Status == q.Status.Value);

        if (q.DateFrom.HasValue)
            filtered = filtered.Where(o => o.CreatedAt >= q.DateFrom.Value);

        if (q.DateTo.HasValue)
            filtered = filtered.Where(o => o.CreatedAt <= q.DateTo.Value);

        var total = filtered.Count();

        // Sắp xếp & phân trang trên bộ nhớ
        var page = q.Page <= 0 ? 1 : q.Page;
        var pageSize = q.PageSize <= 0 ? 20 : q.PageSize;

        var items = filtered
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new OrderSummaryDto(
                o.OrderNo,
                o.CustomerId,
                o.Total,
                o.Status,
                o.CreatedAt
            ))
            .ToList();

        var result = new PagedResult<OrderSummaryDto>(items, page, pageSize, total);
        return ApiResponse<PagedResult<OrderSummaryDto>>.CreateSuccessResponse(result, "Ok");
    }

    public async Task<ApiResponse<bool>> UpdateStatusAsync(string orderNo, OrderStatus status)
    {
        var o = (await _uow.Orders.GetManyAsync(x => x.OrderNo == orderNo)).FirstOrDefault();
        if (o is null) return ApiResponse<bool>.Failure("Order not found");

        o.Status = status;
        await _uow.Orders.UpdateAsync(o);
        await _uow.SaveChangesAsync();

        return ApiResponse<bool>.CreateSuccessResponse(true, "Updated");
    }

    public async Task<ApiResponse<List<OrderBriefDto>>> GetRecentMineAsync(int customerId, int take)
    {
        var all = await _uow.Orders.GetManyAsync(o => o.CustomerId == customerId);
        var list = all
            .OrderByDescending(o => o.CreatedAt)
            .Take(take <= 0 ? 5 : take)
            .Select(o => new OrderBriefDto(o.Id, o.OrderNo, o.CreatedAt, o.Status.ToString(), o.Total))
            .ToList();

        return ApiResponse<List<OrderBriefDto>>.CreateSuccessResponse(list, "Ok");
    }

    public async Task<ApiResponse<MyOrderSummaryDto>> GetMySummaryAsync(int customerId)
    {
        // Lấy CHỈ đơn của user này (tránh GetByIdAsync vì đó là theo Order.Id)
        var orders = await _uow.Orders.GetManyAsync(o => o.CustomerId == customerId);

        var total = orders.Count();
        var inProg = orders.Count(o => o.Status == OrderStatus.Pending || o.Status == OrderStatus.AwaitingPayment);
        var completed = orders.Count(o => o.Status == OrderStatus.Paid || o.Status == OrderStatus.Fulfilled);
        var sum = orders.Sum(o => o.Total);

        var data = new MyOrderSummaryDto(total, inProg, completed, sum);
        return ApiResponse<MyOrderSummaryDto>.CreateSuccessResponse(data, "Ok");
    }
}
