using SharedKernel.Entites;
using System.Text.Json.Serialization;

namespace Order.Domain.Entities;

public class CartItem : BaseEntity
{
    public int CartId { get; set; }
    [JsonIgnore]
    public Cart Cart { get; set; } = default!;
    public string Sku { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string Name { get; set; } = string.Empty; // Tên sản phẩm
    public string? ImageUrl { get; set; } // Hình ảnh sản phẩm
}
