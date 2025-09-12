using InvoiceService.Domain.Entities;
using InvoiceService.Domain.Interfaces;
using InvoiceService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace InvoiceService.Infrastructure.Repositories;

public class ReceiptRepository : IReceiptRepository
{
    private readonly InvoiceDbContext _db;
    public ReceiptRepository(InvoiceDbContext db) => _db = db;

    public async Task AddAsync(Receipt receipt, CancellationToken ct = default) => await _db.Receipts.AddAsync(receipt, ct);
    public async Task<Receipt?> GetAsync(int id, CancellationToken ct = default) => await _db.Receipts.FindAsync([id], ct);
    public IQueryable<Receipt> Query() => _db.Receipts.AsNoTracking();
    public Task SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}
