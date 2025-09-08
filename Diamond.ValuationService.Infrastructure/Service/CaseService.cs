using System;
using System.Linq;
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
        // Tạo hoặc tìm contact (theo Email + Phone)
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
                PreferredMethod = dto.PreferredMethod,
                UserId = dto.UserId               // nếu có UserId thì gán luôn ở đây
            };
            _db.Contacts.Add(contact);
        }
        else
        {
            // nếu dto.UserId có giá trị mà contact.UserId chưa có, có thể đồng bộ:
            if (dto.UserId.HasValue && contact.UserId != dto.UserId)
                contact.UserId = dto.UserId;
        }

        // Lấy hoặc tạo ValuationRequest
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

        // Tạo ValuationCase
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

            // Nếu entity của bạn có 2 chỗ lưu UserId (trên Contact và trên Case),
            // thì giữ cả 2 cho thuận tiện truy vấn:
            UserId = dto.UserId,      // int? (tuỳ schema của bạn)
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

    /// <summary>
    /// Lấy danh sách case của chính user (role User).
    /// userId: int? để khớp với Contact.UserId (int?) hiện có.
    /// </summary>
    public async Task<PagedResult<CaseListItemDto>> GetCasesForUserAsync(
     int? userId, int page, int pageSize, string? status, CancellationToken ct)
    {
        var q = _db.ValuationCases
            .AsNoTracking()
            .Where(x => x.Contact.UserId == userId);

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<CaseStatus>(status, true, out var st))
        {
            q = q.Where(x => x.Status == st);
        }

        var total = await q.CountAsync(ct);

        var items = await q.OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new CaseListItemDto(
                x.Id,
                x.Status.ToString(),
                ProgressOf(x.Status),
                /* consultantName */ null,           // chưa có bảng Staff/Consultant
                x.EstimatedValue,
                x.CreatedAt
            ))
            .ToListAsync(ct);

        return new PagedResult<CaseListItemDto>(items, page, pageSize, total);
    }


    /// <summary>
    /// Lấy chi tiết 1 case của chính user (role User).
    /// </summary>
    public async Task<CaseDetailDto?> GetCaseDetailForUserAsync(Guid id, int userId, CancellationToken ct)
    {
        var data = await _db.ValuationCases
            .AsNoTracking()
            .Where(x => x.Id == id && x.Contact.UserId == userId)
            .Select(x => new CaseDetailDto
            {
                Id = x.Id,
                Status = x.Status.ToString(),
                Progress = ProgressOf(x.Status),
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,

                Diamond = new DiamondInfoDto
                {
                    CertificateNo = x.CertificateNo,
                    Origin = x.Origin,
                    Shape = x.Shape,
                    Carat = x.Carat,
                    Color = x.Color,
                    Clarity = x.Clarity,
                    Cut = x.Cut,
                    Polish = x.Polish,
                    Symmetry = x.Symmetry,
                    Fluorescence = x.Fluorescence
                },
                Contact = new ContactDto
                {
                    Id = x.Contact.Id,
                    FullName = x.Contact.FullName,
                    Email = x.Contact.Email,
                    Phone = x.Contact.Phone,
                    PreferredMethod = x.Contact.PreferredMethod,
                    UserId = x.Contact.UserId
                },
                ConsultantName = null,                // chưa có Staff
                EstimatedValue = x.EstimatedValue
            })
            .FirstOrDefaultAsync(ct);

        return data;
    }

    private static int ProgressOf(CaseStatus st) => st switch
    {
        CaseStatus.YeuCau => 10,   // Yêu cầu mới
        CaseStatus.LienHe => 25,   // Đã liên hệ
        CaseStatus.BienLai => 40,   // Đã có biên lai
        CaseStatus.DinhGia => 65,   // Đang định giá
        CaseStatus.KetQua => 85,   // Đã có kết quả
        CaseStatus.Complete => 100,  // Hoàn tất
        _ => 0
    };

}
