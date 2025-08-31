using InvoiceService.Domain.Entities;

namespace InvoiceService.Domain.Interfaces;

public interface IReceiptRepository
{
    Task AddAsync(Receipt receipt, CancellationToken ct = default);
    Task<Receipt?> GetAsync(Guid id, CancellationToken ct = default);
    IQueryable<Receipt> Query();
    Task SaveChangesAsync(CancellationToken ct = default);
}
