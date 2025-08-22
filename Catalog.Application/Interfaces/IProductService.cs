using Catalog.Domain.Entities;
using Catalog.Application.DTOs;

namespace Catalog.Application.Interfaces
{
    public interface IProductService
    {
        Task<Product> CreateAsync(CreateProductDto dto);
        Task<Product?> GetAsync(Guid id);
        Task<IEnumerable<Product>> GetAllAsync();
    }
}
