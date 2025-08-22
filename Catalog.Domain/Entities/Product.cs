using Catalog.Domain.ValueObjects;

namespace Catalog.Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public Carat Carat { get; set; } = default!;
        public Color Color { get; set; } = default!;
        public Clarity Clarity { get; set; } = default!;
        public Cut Cut { get; set; } = default!;
    }
}
