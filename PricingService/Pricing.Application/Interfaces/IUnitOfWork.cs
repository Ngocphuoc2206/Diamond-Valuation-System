using SharedLibrary.Interfaces;
using Pricing.Domain.Entities;

namespace Pricing.Application.Interfaces;

public interface IUnitOfWork
{
    IGenericRepository<PriceList> PriceLists { get; }
    IGenericRepository<Price> Prices { get; }
    Task<int> SaveChangesAsync();
}
