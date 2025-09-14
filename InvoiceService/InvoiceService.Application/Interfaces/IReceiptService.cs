using InvoiceService.Application.DTOs;
using InvoiceService.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace InvoiceService.Application.Interfaces;

public interface IReceiptService
{
    Task<ReceiptResponse> CreateAsync(CreateReceiptRequest request, CancellationToken ct = default);
    Task<ReceiptResponse?> GetAsync(int id, CancellationToken ct = default);
    Task<(IEnumerable<ReceiptResponse> Items, int Total)> SearchAsync(
        string? receiptNo, DateOnly? from, DateOnly? to, int? appraiserId, ReceiptStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<ReceiptResponse> UpdateAsync(int id, CreateReceiptRequest request, CancellationToken ct = default);
    Task CancelAsync(int id, CancellationToken ct = default);
}
