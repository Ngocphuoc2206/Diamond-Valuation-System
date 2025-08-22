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
        // Kiểm tra dữ liệu đầu vào
        var cart = await _uow.Carts.GetByAsync(c => c.CartKey == dto.CartKey);
        if (cart is null) return ApiResponse<Order.Domain.Entities.Order>.Failure("Cart not found");

        var items = await _uow.CartItems.GetManyAsync(ci => ci.CartId == cart.Id);
        if (!items.Any()) return ApiResponse<Order.Domain.Entities.Order>.Failure("Cart empty");

        // Kiểm tra tồn kho + giá real-time từ Catalog/Pricing (nếu có)
        var subtotal = items.Sum(i => i.UnitPrice * i.Quantity);

        var order = new Order.Domain.Entities.Order
        {
            OrderNo = $"OD{DateTime.UtcNow:yyyyMMddHHmmss}{cart.Id}",
            CustomerId = dto.CustomerId,
            Subtotal = subtotal,
            Discount = 0,
            ShippingFee = dto.ShippingFee,
            Total = subtotal + dto.ShippingFee,
            Status = OrderStatus.AwaitingPayment
        };
        await _uow.Orders.CreateAsync(order);

        // Tạo OrderItem từ CartItem
        foreach (var i in items)
        {
            var oi = new OrderItem
            {
                OrderId = order.Id,
                Sku = i.Sku,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.UnitPrice * i.Quantity
            };
            await _uow.OrderItems.CreateAsync(oi);
        }

        // Phát event OrderPlaced (Outbox → RabbitMQ) để Payment Service xử lý
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
