using SharedLibrary.Interfaces;
using Payment.Domain.Entities;

namespace Payment.Domain.Interfaces;

public interface IUnitOfWork
{
    IGenericRepository<Payment.Domain.Entities.Payment> Payments { get; }
    IGenericRepository<Refund> Refunds { get; }
    IGenericRepository<OutboxMessage> Outbox { get; }
    Task<int> SaveChangesAsync();
}
