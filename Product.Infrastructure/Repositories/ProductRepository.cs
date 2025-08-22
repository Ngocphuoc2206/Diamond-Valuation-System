using Microsoft.EntityFrameworkCore;
using Product.Application.Interfaces;
using Product.Domain.Entities;
using Product.Infrastructure.Persistence;

namespace Product.Domain.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ProductDbContext _db;
        public ProductRepository(ProductDbContext db) => _db = db;

        public async Task<List<Domain.Entities.Product>> GetAllAsync() => await _db.Products.ToListAsync();
        public async Task<Domain.Entities.Product?> GetByIdAsync(Guid id) => await _db.Products.FindAsync(id);

        public async Task AddAsync(Domain.Entities.Product product)
        {
            _db.Products.Add(product);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Domain.Entities.Product product)
        {
            _db.Products.Update(product);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p != null)
            {
                _db.Products.Remove(p);
                await _db.SaveChangesAsync();
            }
        }
    }
}
