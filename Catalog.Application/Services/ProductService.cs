using Catalog.Application.DTOs;
using Catalog.Application.Interfaces;
using Catalog.Domain.Entities;
using Catalog.Domain.Repositories;

namespace Catalog.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task<Product> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Carat = dto.Carat,
                Color = dto.Color,
                Clarity = dto.Clarity,
                Cut = dto.Cut,
                Price = dto.Price
            };

            return await _repo.AddAsync(product);
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Product?> UpdateAsync(Guid id, UpdateProductDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Name = dto.Name;
            existing.Carat = dto.Carat;
            existing.Color = dto.Color;
            existing.Clarity = dto.Clarity;
            existing.Cut = dto.Cut;
            existing.Price = dto.Price;

            return await _repo.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            return await _repo.DeleteAsync(existing);
        }

        // Task IProductService.DeleteAsync(Guid id)
        // {
        //     return DeleteAsync(id);
        // }

        public Task GetAllAsync(string? color, decimal? caratMin, decimal? caratMax)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Product>> GetFilteredAsync(string? color, decimal? caratMin, decimal? caratMax)
        {
            return await _repo.GetFilteredAsync(color, caratMin, caratMax);
        }

    }
}
