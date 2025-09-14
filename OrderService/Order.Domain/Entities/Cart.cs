using SharedKernel.Entites;

namespace Order.Domain.Entities;

public class Cart : BaseEntity
{
    public string CartKey { get; set; } = Guid.NewGuid().ToString("N"); // Cho Guest
    public int? CustomerId { get; set; }     // Nếu đã đăng nhập
    public decimal Total { get; set; }
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
