using SharedKernel.Entites;

namespace Order.Domain.Entities;

public enum OrderStatus { Pending, AwaitingPayment, Paid, Cancelled, Fulfilled }

public class Order : BaseEntity
{
    public string OrderNo { get; set; } = string.Empty;
    public int? CustomerId { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
