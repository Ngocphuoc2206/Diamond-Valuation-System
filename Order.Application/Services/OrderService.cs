using Order.Application.DTOs;
using Order.Application.Interfaces;
using Order.Application.Services.Interfaces;
using Order.Domain.Entities;
using SharedLibrary.Response;

namespace Order.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _uow;
    public OrderService(IUnitOfWork uow) { _uow = uow; }

    public async Task<ApiResponse<Order.Domain.Entities.Order>> CheckoutAsync(CheckoutDto dto)
    {
        // Resolve cart theo ưu tiên:
        // 1 Nếu có CartKey => lấy cart theo CartKey (Customer)
        // 2 Nếu không có CartKey nhưng có CustomerId => lấy cart theo CustomerId (non-customer)
        // 3 Nếu không có cả hai => lỗi
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

        var order = new Order.Domain.Entities.Order
        {
            OrderNo = $"OD{DateTime.UtcNow:yyyyMMddHHmmss}{cart.Id}",
            CustomerId = dto.CustomerId,           // với Customer có thể null; tuỳ business bạn set sau
            Subtotal = subtotal,
            Discount = 0,
            ShippingFee = dto.ShippingFee,
            Total = subtotal + dto.ShippingFee,
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

        // (tuỳ chọn) clear cart sau khi đặt hàng
        foreach (var it in items)
            await _uow.CartItems.DeleteAsync(it);
        await _uow.Carts.UpdateAsync(cart);
        await _uow.SaveChangesAsync();

        return ApiResponse<Order.Domain.Entities.Order>.CreateSuccessResponse(order, "Order placed");
    }


    public async Task<ApiResponse<Order.Domain.Entities.Order>> GetAsync(string orderNo)
    {
        // Kiểm tra theo OrderNo
        var o = await _uow.Orders.GetByAsync(o => o.OrderNo == orderNo);
        if (o is null) return ApiResponse<Order.Domain.Entities.Order>.Failure("Not found");

        o.Items = (await _uow.OrderItems.GetManyAsync(oi => oi.OrderId == o.Id)).ToList();
        return ApiResponse<Order.Domain.Entities.Order>.CreateSuccessResponse(o, "Ok");
    }
}
