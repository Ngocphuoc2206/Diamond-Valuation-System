using AutoMapper;
using InvoiceService.Application.DTOs;
using InvoiceService.Application.Interfaces;
using InvoiceService.Domain.Entities;
using InvoiceService.Domain.Enums;
using InvoiceService.Domain.Interfaces;
using InvoiceService.Domain.ValueObjects;

namespace InvoiceService.Application.Services;

public class ReceiptService : IReceiptService
{
    private readonly IReceiptRepository _repo;
    private readonly IMapper _mapper;
    private readonly IReceiptNumberGenerator _numberGen;

    public ReceiptService(IReceiptRepository repo, IMapper mapper, IReceiptNumberGenerator numberGen)
    {
        _repo = repo; _mapper = mapper; _numberGen = numberGen;
    }

    public async Task<ReceiptResponse> CreateAsync(CreateReceiptRequest request, CancellationToken ct = default)
    {
        var receiptNo = string.IsNullOrWhiteSpace(request.ReceiptNo) 
            ? await _numberGen.GenerateAsync(request.ReceiptDate, ct) 
            : request.ReceiptNo!;

        var entity = new Receipt(
            receiptNo,
            request.ReceiptDate,
            request.AppraiserId,
            request.EstimatedValue,
            _mapper.Map<DiamondInfo>(request.Diamond),
            request.Notes);

        await _repo.AddAsync(entity, ct);
        await _repo.SaveChangesAsync(ct);

        return _mapper.Map<ReceiptResponse>(entity);
    }

    public async Task<ReceiptResponse?> GetAsync(Guid id, CancellationToken ct = default)
        => _mapper.Map<ReceiptResponse?>(await _repo.GetAsync(id, ct));

    public async Task<(IEnumerable<ReceiptResponse>, int)> SearchAsync(string? receiptNo, DateOnly? from, DateOnly? to, Guid? appraiserId, ReceiptStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _repo.Query();
        if (!string.IsNullOrWhiteSpace(receiptNo)) q = q.Where(x => x.ReceiptNo.Contains(receiptNo));
        if (from.HasValue) q = q.Where(x => x.ReceiptDate >= from.Value);
        if (to.HasValue) q = q.Where(x => x.ReceiptDate <= to.Value);
        if (appraiserId.HasValue) q = q.Where(x => x.AppraiserId == appraiserId.Value);
        if (status.HasValue) q = q.Where(x => x.Status == status.Value);

        var total = q.Count();
        var items = q.OrderByDescending(x => x.ReceiptDate)
                     .Skip((page - 1) * pageSize)
                     .Take(pageSize)
                     .ToList();

        return (_mapper.Map<IEnumerable<ReceiptResponse>>(items), total);
    }

    public async Task<ReceiptResponse> UpdateAsync(Guid id, CreateReceiptRequest request, CancellationToken ct = default)
    {
        var r = await _repo.GetAsync(id, ct) ?? throw new KeyNotFoundException("Receipt not found");
        r.Update(request.EstimatedValue, _mapper.Map<DiamondInfo>(request.Diamond), request.Notes);
        await _repo.SaveChangesAsync(ct);
        return _mapper.Map<ReceiptResponse>(r);
    }

    public async Task CancelAsync(Guid id, CancellationToken ct = default)
    {
        var r = await _repo.GetAsync(id, ct) ?? throw new KeyNotFoundException("Receipt not found");
        r.Cancel();
        await _repo.SaveChangesAsync(ct);
    }
}

// Interface cho generator số biên nhận
public interface IReceiptNumberGenerator { Task<string> GenerateAsync(DateOnly receiptDate, CancellationToken ct); }
