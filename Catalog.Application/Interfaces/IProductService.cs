using Catalog.Application.DTOs;
using Catalog.Domain.Entities;

namespace Catalog.Application.Interfaces
{
    public interface IProductService
    {
        Task<Product> CreateAsync(CreateProductDto dto);
        Task<Product?> GetByIdAsync(Guid id);
        // Task<IEnumerable<Product>> GetAllAsync(); // nếu muốn có 2 overload thì rename

    Task<IEnumerable<Product>> GetFilteredAsync(string? color, decimal? caratMin, decimal? caratMax); 

        Task<Product?> UpdateAsync(Guid id, UpdateProductDto dto);

        Task<bool> DeleteAsync(Guid id); // return bool để controller biết có xóa được hay không
        
    }
}
