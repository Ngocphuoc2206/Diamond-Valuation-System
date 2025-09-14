namespace Product.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }

        // Tên sản phẩm hiển thị (VD: "Classic Solitaire Ring")
        public string Name { get; set; } = default!;

        // Mô tả ngắn (VD: "2.5ct Round Brilliant")
        public string Description { get; set; } = default!;

        // SKU duy nhất cho sản phẩm (VD: RING-2024-001)
        public string Sku { get; set; }

        // Danh mục (VD: Engagement Rings, Necklaces)
        public string Category { get; set; } = default!;

        // Giá sản phẩm
        public decimal Price { get; set; }

        // Tồn kho (Stock quantity)
        public int Stock { get; set; }

        // Trạng thái (Active, Inactive, Archived)
        public string Status { get; set; } = "Active";

        // Ảnh đại diện sản phẩm
        public string? ImageUrl { get; set; }

        // Ngày tạo
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
