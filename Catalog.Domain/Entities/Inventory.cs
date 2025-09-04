using System;

namespace Catalog.Domain.Entities
{
    public class Inventory
    {
        public Guid Id { get; set; }

        // Khóa ngoại liên kết Product
        public Guid ProductId { get; set; }

        public int Quantity { get; set; }

        public string Location { get; set; } = string.Empty;

        public string Status { get; set; } = "Available";

        // Navigation property: liên kết tới Product
        public Product Product { get; set; } = null!;
    }
}
