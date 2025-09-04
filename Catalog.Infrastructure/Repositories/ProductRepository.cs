using Catalog.Domain.Entities;
using Catalog.Domain.Repositories;
using Catalog.Infrastructure.Db;
using Microsoft.EntityFrameworkCore;

namespace Catalog.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly CatalogDbContext _db;

        public ProductRepository(CatalogDbContext db)
        {
            _db = db;
        }

        public async Task<Product> AddAsync(Product product)
        {
            _db.Products.Add(product);
            await _db.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _db.Products.ToListAsync();
        }

        // public Task<Product> UpdateAsync(Product product)
        // {
        //     throw new NotImplementedException();
        // }

        // public Task<bool> DeleteAsync(Product product)
        // {
        //     throw new NotImplementedException();
        // }

        public async Task<Product> UpdateAsync(Product product)
        {
            // Cập nhật product trong DbContext
            _db.Products.Update(product);
            await _db.SaveChangesAsync();
            return product;
        }

        public async Task DeleteAsync(Product product)
        {
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
        }

        Task<bool> IProductRepository.DeleteAsync(Product product)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Product>> GetFilteredAsync(string? color, decimal? caratMin, decimal? caratMax)
        {
            var query = _db.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(color))
                query = query.Where(p => p.Color == color);

            if (caratMin.HasValue)
                query = query.Where(p => p.Carat >= caratMin.Value);

            if (caratMax.HasValue)
                query = query.Where(p => p.Carat <= caratMax.Value);

            return await query.ToListAsync();
        }

    }
}
