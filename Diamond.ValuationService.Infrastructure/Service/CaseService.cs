using System;
using System.Threading;
using System.Threading.Tasks;
using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Infrastructure.Services;

public class CaseService : ICaseService
{
    private readonly AppDbContext _db;
    public CaseService(AppDbContext db) => _db = db;

    public async Task<CreateCaseResponseDto> CreateAsync(CreateCaseRequestDto dto, CancellationToken ct = default)
    {
        // 1) Tạo hoặc tìm contact (theo Email + Phone)
        var contact = await _db.Contacts
            .FirstOrDefaultAsync(x => x.Email == dto.Email && x.Phone == dto.Phone, ct);

        if (contact is null)
        {
            contact = new Contact
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                PreferredMethod = dto.PreferredMethod
            };
            _db.Contacts.Add(contact);
        }

        // 2) Lấy hoặc tạo ValuationRequest
        ValuationRequest req;
        if (dto.ExistingRequestId is Guid rid)
        {
            req = await _db.ValuationRequests
                .Include(r => r.Spec)
                .FirstOrDefaultAsync(r => r.Id == rid, ct)
                ?? throw new InvalidOperationException("Estimate request không tồn tại");
        }
        else
        {
            req = new ValuationRequest
            {
                Id = Guid.NewGuid(),
                CertificateNo = dto.CertificateNo,
                CustomerName = dto.FullName,
                Spec = new DiamondSpec
                {
                    Origin = dto.Origin,
                    Shape = dto.Shape,
                    Carat = dto.Carat,
                    Color = dto.Color,
                    Clarity = dto.Clarity,
                    Cut = dto.Cut,
                    Polish = dto.Polish,
                    Symmetry = dto.Symmetry,
                    Fluorescence = dto.Fluorescence,
                    TablePercent = dto.TablePercent,
                    DepthPercent = dto.DepthPercent,
                    Measurements = dto.Measurements ?? string.Empty
                },
                RequestedAt = DateTime.UtcNow
            };
            _db.ValuationRequests.Add(req);
        }

        //Tạo ValuationCase
        var vc = new ValuationCase
        {
            Id = Guid.NewGuid(),
            CertificateNo = dto.CertificateNo,
            Origin = dto.Origin,
            Shape = dto.Shape,
            Carat = dto.Carat,
            Color = dto.Color,
            Clarity = dto.Clarity,
            Cut = dto.Cut,
            Polish = dto.Polish,
            Symmetry = dto.Symmetry,
            Fluorescence = dto.Fluorescence,

            Status = CaseStatus.YeuCau,
            CreatedAt = DateTime.UtcNow,

            ContactId = contact.Id,
            Contact = contact,

            UserId = dto.UserId,
            RequestId = req.Id,
            Request = req
        };

        _db.ValuationCases.Add(vc);
        await _db.SaveChangesAsync(ct);

        return new CreateCaseResponseDto(vc.Id, vc.Status.ToString());
    }


    public async Task<bool> UpdateStatusAsync(Guid caseId, CaseStatus status, CancellationToken ct = default)
    {
        var vc = await _db.ValuationCases.FirstOrDefaultAsync(x => x.Id == caseId, ct);
        if (vc is null) return false;

        // TODO: thêm validation chuyển trạng thái nếu có quy tắc business
        vc.Status = status;
        vc.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return true;
    }
}
