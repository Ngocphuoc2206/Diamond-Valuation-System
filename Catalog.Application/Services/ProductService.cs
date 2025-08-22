using Catalog.Application.DTOs;
using Catalog.Application.Interfaces;
using Catalog.Domain.Entities;

namespace Catalog.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly List<Product> _products = new();

        public Task<Product> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Price = dto.Price,
                Carat = new Domain.ValueObjects.Carat(dto.Carat),
                Color = new Domain.ValueObjects.Color(dto.Color),
                Clarity = new Domain.ValueObjects.Clarity(dto.Clarity),
                Cut = new Domain.ValueObjects.Cut(dto.Cut)
            };
            _products.Add(product);
            return Task.FromResult(product);
        }

        public Task<Product?> GetAsync(Guid id)
        {
            return Task.FromResult(_products.FirstOrDefault(p => p.Id == id));
        }

        public Task<IEnumerable<Product>> GetAllAsync()
        {
            return Task.FromResult<IEnumerable<Product>>(_products);
        }
    }
}
