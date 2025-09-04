namespace Catalog.Domain.Entities
{
    using Catalog.Domain.ValueObjects;
    using SharedKernel;
    using System.ComponentModel.DataAnnotations.Schema;


    // [Table("Products", Schema = "catalog")]
    public class Product : BaseEntity
    {
        // public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Carat { get; set; }
        public string Color { get; set; } = default!;
        public string Clarity { get; set; } = default!;
        public string Cut { get; set; } = default!;
        public decimal Price { get; set; }
        public string Shape { get; set; } = string.Empty;

        public Product() { } // EF Core

        // public Product(string name, Carat carat, Color color, Clarity clarity, Cut cut, decimal price)
        // {
        //     Name = name;
        //     Carat = carat;
        //     Color = color;
        //     Clarity = clarity;
        //     Cut = cut;
        //     Price = price;
        // }

        // public void Update(string name, Carat carat, Color color, Clarity clarity, Cut cut, decimal price)
        // {
        //     Name = name;
        //     Carat = carat;
        //     Color = color;
        //     Clarity = clarity;
        //     Cut = cut;
        //     Price = price;
        // }
    }
}
