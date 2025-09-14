using AutoMapper;
using InvoiceService.Application.DTOs;
using InvoiceService.Application.Interfaces;
using InvoiceService.Domain.Entities;
using InvoiceService.Domain.Enums;
using InvoiceService.Domain.Interfaces;
using InvoiceService.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore; // để dùng CountAsync/ToListAsync
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

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
        // Tạo số biên nhận nếu không truyền vào
        var receiptNo = string.IsNullOrWhiteSpace(request.ReceiptNo)
            ? await _numberGen.GenerateAsync(request.ReceiptDate, ct)
            : request.ReceiptNo!;

        var diamond = _mapper.Map<DiamondInfo>(request.Diamond);

        // Khởi tạo entity kèm thông tin khách hàng & liên kết case (nếu có)
        var entity = new Receipt(
            receiptNo,
            request.ReceiptDate,
            request.AppraiserId,
            request.EstimatedValue,
            diamond,
            request.Notes,
            customerName: request.CustomerName,
            customerEmail: request.CustomerEmail,
            customerPhone: request.CustomerPhone,
            customerAddress: request.CustomerAddress,
            customerId: request.CustomerId,
            caseId: request.CaseId
        );

        await _repo.AddAsync(entity, ct);
        await _repo.SaveChangesAsync(ct);

        return _mapper.Map<ReceiptResponse>(entity);
    }

    public async Task<ReceiptResponse?> GetAsync(int id, CancellationToken ct = default)
        => _mapper.Map<ReceiptResponse?>(await _repo.GetAsync(id, ct));

    public async Task<(IEnumerable<ReceiptResponse>, int)> SearchAsync(
        string? receiptNo,
        DateOnly? from,
        DateOnly? to,
        int? appraiserId,
        ReceiptStatus? status,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var q = _repo.Query();

        if (!string.IsNullOrWhiteSpace(receiptNo))
            q = q.Where(x => x.ReceiptNo.Contains(receiptNo));

        if (from.HasValue)
            q = q.Where(x => x.ReceiptDate >= from.Value);

        if (to.HasValue)
            q = q.Where(x => x.ReceiptDate <= to.Value);

        if (appraiserId.HasValue)
            q = q.Where(x => x.AppraiserId == appraiserId);

        if (status.HasValue)
            q = q.Where(x => x.Status == status.Value);

        // Phân trang an toàn
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;

        var total = await q.CountAsync(ct);

        var items = await q.OrderByDescending(x => x.ReceiptDate)
                           .ThenByDescending(x => x.ReceiptNo)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync(ct);

        return (_mapper.Map<IEnumerable<ReceiptResponse>>(items), total);
    }

    public async Task<ReceiptResponse> UpdateAsync(int id, CreateReceiptRequest request, CancellationToken ct = default)
    {
        var r = await _repo.GetAsync(id, ct) ?? throw new KeyNotFoundException("Receipt not found");

        // Cập nhật giá trị, kim cương, ghi chú
        r.Update(
            request.EstimatedValue,
            _mapper.Map<DiamondInfo>(request.Diamond),
            request.Notes
        );

        // Cập nhật thông tin khách hàng (nếu có truyền)
        r.UpdateCustomer(
            name: request.CustomerName,
            email: request.CustomerEmail,
            phone: request.CustomerPhone,
            address: request.CustomerAddress,
            customerId: request.CustomerId
        );

        // Liên kết case (nếu có)
        if (request.CaseId.HasValue)
            r.LinkCase(request.CaseId.Value);

        await _repo.SaveChangesAsync(ct);
        return _mapper.Map<ReceiptResponse>(r);
    }

    public async Task CancelAsync(int id, CancellationToken ct = default)
    {
        var r = await _repo.GetAsync(id, ct) ?? throw new KeyNotFoundException("Receipt not found");
        r.Cancel();
        await _repo.SaveChangesAsync(ct);
    }
}

// Interface cho generator số biên nhận
public interface IReceiptNumberGenerator
{
    Task<string> GenerateAsync(DateOnly receiptDate, CancellationToken ct);
}
