using Product.Application.Interfaces;
using Product.Domain.Entities;

namespace Product.Application.Services
{
    public class ProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Domain.Entities.Product>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Domain.Entities.Product?> GetByIdAsync(Guid id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Domain.Entities.Product> CreateAsync(Domain.Entities.Product product)
        {
            await _repo.AddAsync(product);
            return product;
        }

        public async Task<Domain.Entities.Product?> UpdateAsync(Guid id, Domain.Entities. Product updatedProduct)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Name = updatedProduct.Name;
            existing.Sku = updatedProduct.Sku;
            existing.Description = updatedProduct.Description;
            existing.Category = updatedProduct.Category;
            existing.Price = updatedProduct.Price;
            existing.Stock = updatedProduct.Stock;
            existing.Status = updatedProduct.Status;
            existing.ImageUrl = updatedProduct.ImageUrl;

            await _repo.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            await _repo.DeleteAsync(id);
            return true;
        }
    }
}
