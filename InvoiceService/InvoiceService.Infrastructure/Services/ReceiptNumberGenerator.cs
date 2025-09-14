using InvoiceService.Application.Services;
using InvoiceService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace InvoiceService.Infrastructure.Services;

public class ReceiptNumberGenerator : IReceiptNumberGenerator
{
    private readonly InvoiceDbContext _db;
    public ReceiptNumberGenerator(InvoiceDbContext db) => _db = db;

    public async Task<string> GenerateAsync(DateOnly receiptDate, CancellationToken ct)
    {
        var year = receiptDate.Year;
        var countThisYear = await _db.Receipts.CountAsync(x => x.ReceiptDate.Year == year, ct);
        var seq = countThisYear + 1;
        return $"RCP-{year}-{seq:0000}";
    }
}
