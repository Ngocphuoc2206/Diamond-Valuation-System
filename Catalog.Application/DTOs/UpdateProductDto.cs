namespace Catalog.Application.DTOs
{
    public class UpdateProductDto
    {
        public string Name { get; set; } = null!;
        public decimal Carat { get; set; }
        public string Color { get; set; } = null!;
        public string Clarity { get; set; } = null!;
        public string Cut { get; set; } = null!;
        public decimal Price { get; set; }
    }
}
