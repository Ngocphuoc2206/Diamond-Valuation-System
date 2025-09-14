using Payment.Domain.Entities;
using Payment.Domain.Interfaces;
using Payment.Infrastructure.Data;
using SharedLibrary.Interfaces;

namespace Payment.Infrastructure.UnitOfWork;

public class Uow : IUnitOfWork
{
    private readonly PaymentDbContext _db;
    public Uow(PaymentDbContext db,
        IGenericRepository<Payment.Domain.Entities.Payment> payments,
        IGenericRepository<Refund> refunds,
        IGenericRepository<OutboxMessage> outbox)
    {
        _db = db;
        Payments = payments; Refunds = refunds; Outbox = outbox;
    }

    public IGenericRepository<Payment.Domain.Entities.Payment> Payments { get; }
    public IGenericRepository<Refund> Refunds { get; }
    public IGenericRepository<OutboxMessage> Outbox { get; }

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();
}
