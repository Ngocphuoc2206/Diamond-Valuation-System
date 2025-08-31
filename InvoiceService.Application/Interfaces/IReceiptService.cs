using InvoiceService.Application.DTOs;
using InvoiceService.Domain.Enums;

namespace InvoiceService.Application.Interfaces;

public interface IReceiptService
{
    Task<ReceiptResponse> CreateAsync(CreateReceiptRequest request, CancellationToken ct = default);
    Task<ReceiptResponse?> GetAsync(Guid id, CancellationToken ct = default);
    Task<(IEnumerable<ReceiptResponse> Items, int Total)> SearchAsync(
        string? receiptNo, DateOnly? from, DateOnly? to, Guid? appraiserId, ReceiptStatus? status, int page, int pageSize, CancellationToken ct = default);
    Task<ReceiptResponse> UpdateAsync(Guid id, CreateReceiptRequest request, CancellationToken ct = default);
    Task CancelAsync(Guid id, CancellationToken ct = default);
}
