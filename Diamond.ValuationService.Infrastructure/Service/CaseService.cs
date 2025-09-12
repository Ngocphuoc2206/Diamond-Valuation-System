using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Diamond.ValuationService.Infrastructure.Services;

public class CaseService : ICaseService
{
    private readonly AppDbContext _db;
    private readonly ILogger<CaseService> _logger;

    public CaseService(AppDbContext db, ILogger<CaseService> logger)
    {
        _db = db;
        _logger = logger;
    }

    // ------------------------------
    // Helpers
    // ------------------------------
    private static int ProgressOf(CaseStatus st) => st switch
    {
        CaseStatus.YeuCau => 10,
        CaseStatus.LienHe => 25,
        CaseStatus.BienLai => 40,
        CaseStatus.DinhGia => 65,
        CaseStatus.KetQua => 85,
        CaseStatus.Complete => 100,
        _ => 10
    };

    // ------------------------------
    // Assign
    // ------------------------------
    public async Task<bool> AssignAsync(Guid id, int assigneeId, string? assigneeName, CancellationToken ct = default)
    {
        var entity = await _db.ValuationCases.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return false;

        entity.AssigneeId = assigneeId;
        entity.AssigneeName = assigneeName;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Assigned case {CaseId} to {AssigneeId} ({AssigneeName})", id, assigneeId, assigneeName);
        return true;
    }
    public async Task<bool> AssignValuationAsync(Guid id, int valuationId, string? ValuationName, CancellationToken ct = default)
    {
        var entity = await _db.ValuationCases.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return false;

        entity.ValuationId = valuationId;
        entity.ValuationName = ValuationName;
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Assigned case {CaseId} to {ValuationId} ({ValuationName})", id, valuationId, ValuationName);
        return true;
    }

    // ------------------------------
    // Create
    // ------------------------------
    public async Task<CreateCaseResponseDto> CreateAsync(CreateCaseRequestDto dto, CancellationToken ct = default)
    {
        _logger.LogInformation("Create case begin for {FullName} ({Email}/{Phone})", dto.FullName, dto.Email, dto.Phone);

        // 1) Contact
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
                UserId = dto.UserId
            };
            _db.Contacts.Add(contact);
        }
        else if (dto.UserId.HasValue && contact.UserId != dto.UserId)
        {
            contact.UserId = dto.UserId;
        }

        // 2) Request + Spec
        ValuationRequest req;
        DiamondSpec spec;
        if (dto.ExistingRequestId is Guid rid && rid != Guid.Empty)
        {
            req = await _db.ValuationRequests
                .Include(r => r.Spec)
                .FirstOrDefaultAsync(r => r.Id == rid, ct)
                  ?? throw new InvalidOperationException("Estimate request không tồn tại");

            spec = req.Spec; // dùng spec đã có
        }
        else
        {
            spec = new DiamondSpec
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
            };
            _db.DiamondSpecs.Add(spec);

            req = new ValuationRequest
            {
                Id = Guid.NewGuid(),
                CertificateNo = dto.CertificateNo,
                CustomerName = dto.FullName,
                Spec = spec,                 // EF sẽ set SpecId
                RequestedAt = DateTime.UtcNow
            };
            _db.ValuationRequests.Add(req);
        }

        // 3) Case (snapshot kim cương)
        var vc = new ValuationCase
        {
            Id = Guid.NewGuid(),

            Status = CaseStatus.YeuCau,
            CreatedAt = DateTime.UtcNow,

            CertificateNo = dto.CertificateNo,
            Origin = spec.Origin,
            Shape = spec.Shape,
            Carat = spec.Carat,
            Color = spec.Color,
            Clarity = spec.Clarity,
            Cut = spec.Cut,
            Polish = spec.Polish,
            Symmetry = spec.Symmetry,
            Fluorescence = spec.Fluorescence,

            ContactId = contact.Id,
            Contact = contact,

            UserId = dto.UserId,
            RequestId = req.Id,
            Request = req
        };

        _db.ValuationCases.Add(vc);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Create case success: {CaseId}", vc.Id);
        return new CreateCaseResponseDto(vc.Id, vc.Status.ToString());
    }

    // ------------------------------
    // Update Status
    // ------------------------------
    public async Task<bool> UpdateStatusAsync(Guid caseId, CaseStatus status, CancellationToken ct = default)
    {
        _logger.LogInformation("Update status for case {CaseId} -> {Status}", caseId, status);

        var vc = await _db.ValuationCases.FirstOrDefaultAsync(x => x.Id == caseId, ct);
        if (vc is null)
        {
            _logger.LogWarning("Case {CaseId} not found", caseId);
            return false;
        }

        vc.Status = status;
        vc.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return true;
    }

    // ------------------------------
    // User Portal — List my cases
    // ------------------------------
    public async Task<PagedResult<CaseListItemDto>> GetCasesForUserAsync(
        int? userId, int page, int pageSize, string? status, CancellationToken ct)
    {
        if (userId is null) return new PagedResult<CaseListItemDto>(Array.Empty<CaseListItemDto>(), page, pageSize, 0);

        var q = _db.ValuationCases
            .AsNoTracking()
            .Where(x => x.Contact.UserId == userId);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<CaseStatus>(status, true, out var st))
            q = q.Where(x => x.Status == st);

        var total = await q.CountAsync(ct);

        var items = await q.OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new CaseListItemDto(
                x.Id,
                x.Status.ToString(),
                ProgressOf(x.Status),
                /* consultantName */ x.AssigneeName,
                x.ValuationName,
                x.EstimatedValue,
                x.CreatedAt,
                // Contact
                new MiniContactDto(
                    x.Contact != null ? x.Contact.FullName : null,
                    x.Contact != null ? x.Contact.Email : null,
                    x.Contact != null ? x.Contact.Phone : null,
                    x.Contact != null ? x.Contact.UserId : null
                ),
                // Diamond (từ Request.Spec nếu có; nếu null thì dùng snapshot sẵn trên Case)
                new MiniDiamondDto(
                    x.Request != null && x.Request.Spec != null
                        ? x.Request.Spec.Origin
                        : x.Origin,
                    x.Request != null && x.Request.Spec != null
                        ? (decimal?)x.Request.Spec.Carat
                        : x.Carat,
                    x.Request != null && x.Request.Spec != null
                        ? x.Request.Spec.Color 
                        : x.Color,
                    x.Request != null && x.Request.Spec != null
                        ? x.Request.Spec.Shape
                        : x.Shape,
                    x.Request != null && x.Request.Spec != null
                        ? x.Request.Spec.Clarity
                        : x.Clarity,
                    x.Request != null && x.Request.Spec != null
                        ? x.Request.Spec.Cut
                        : x.Cut
                )
            ))
            .ToListAsync(ct);

        return new PagedResult<CaseListItemDto>(items, page, pageSize, total);
    }

    // ------------------------------
    // User Portal — Case detail
    // ------------------------------
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
                ConsultantName = x.AssigneeName,
                EstimatedValue = x.EstimatedValue
            })
            .FirstOrDefaultAsync(ct);

        return data;
    }
}
