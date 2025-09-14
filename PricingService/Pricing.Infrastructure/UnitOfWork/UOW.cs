using Pricing.Application.Interfaces;
using Pricing.Domain.Entities;
using Pricing.Infrastructure.Data;
using SharedLibrary.Interfaces;

namespace Pricing.Infrastructure.UnitOfWork;

public class Uow : IUnitOfWork
{
    private readonly PricingDbContext _db;
    public Uow(PricingDbContext db,
        IGenericRepository<PriceList> lists,
        IGenericRepository<Price> prices)
    {
        _db = db;
        PriceLists = lists; Prices = prices;
    }

    public IGenericRepository<PriceList> PriceLists { get; }
    public IGenericRepository<Price> Prices { get; }

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();
}
