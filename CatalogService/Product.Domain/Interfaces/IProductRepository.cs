using Product.Domain.Entities;

namespace Product.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Domain.Entities.Product>> GetAllAsync();
        Task<Domain.Entities.Product?> GetByIdAsync(Guid id);
        Task AddAsync(Domain.Entities.Product product);
        Task UpdateAsync(Domain.Entities.Product product);
        Task DeleteAsync(Guid id);
    }
}
