using Catalog.Domain.Entities;

namespace Catalog.Domain.Repositories
{
    public interface IProductRepository
    {
        Task<Product> AddAsync(Product product);
        Task<Product?> GetByIdAsync(Guid id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product> UpdateAsync(Product product);
        Task<bool> DeleteAsync(Product product);
        // Task<IEnumerable<Product>> GetFilteredAsync(string? color, decimal? caratMin, decimal? caratMax);
        Task<IEnumerable<Product>> GetFilteredAsync(string? color, decimal? caratMin, decimal? caratMax);

    }
}
