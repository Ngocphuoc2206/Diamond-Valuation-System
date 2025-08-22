namespace Catalog.Application.DTOs
{
    public class CreateProductDto
    {
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public decimal Carat { get; set; }
        public string Color { get; set; } = default!;
        public string Clarity { get; set; } = default!;
        public string Cut { get; set; } = default!;
    }
}
