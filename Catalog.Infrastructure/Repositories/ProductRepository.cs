using Catalog.Domain.Entities;

namespace Catalog.Infrastructure.Repositories
{
    public class ProductRepository
    {
        private readonly List<Product> _products = new();
        public void Add(Product p) => _products.Add(p);
    }
}
