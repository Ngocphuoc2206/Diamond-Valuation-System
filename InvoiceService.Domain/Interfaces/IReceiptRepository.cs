using InvoiceService.Domain.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace InvoiceService.Domain.Interfaces;

public interface IReceiptRepository
{
    Task AddAsync(Receipt receipt, CancellationToken ct = default);
    Task<Receipt?> GetAsync(int id, CancellationToken ct = default);
    IQueryable<Receipt> Query();
    Task SaveChangesAsync(CancellationToken ct = default);
}
