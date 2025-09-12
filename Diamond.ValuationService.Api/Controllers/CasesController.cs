using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Diamond.ValuationService.Api.Controllers;

[ApiController]
[Route("api/cases")]
[Produces("application/json")]
public class CasesController : ControllerBase
{
    private readonly ICaseService _svc;
    private readonly AppDbContext _db;
    private readonly ILogger<CasesController> _logger;

    public CasesController(ICaseService svc, AppDbContext db, ILogger<CasesController> logger)
    {
        _svc = svc;
        _db = db;
        _logger = logger;
    }

    private string? GetUserId()
    {
        var sub = User.Claims.FirstOrDefault(c =>
            c.Type == "uid" || c.Type == ClaimTypes.NameIdentifier || c.Type == "sub")?.Value;

        foreach (var claim in User.Claims)
            _logger.LogInformation("Claim: {Type} = {Value}", claim.Type, claim.Value);

        return string.IsNullOrWhiteSpace(sub) ? null : sub;
    }

    private static int MapProgress(CaseStatus st) => st switch
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
    // Create
    // ------------------------------
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CreateCaseResponseDto>> Create([FromBody] CreateCaseRequestDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var uid = GetUserId();
        _logger.LogInformation("Creating case for userId: {UserId}", uid);

        if (string.IsNullOrWhiteSpace(uid))
            return Unauthorized("Missing user id in token.");

        dto.UserId = int.TryParse(uid, out var id) ? id : null;

        var res = await _svc.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = res.CaseId }, res);
    }

    // ------------------------------ GetMine ------------------------------
    [Authorize]
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<object>>> GetMine(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        var uid = GetUserId();
        var userID = int.TryParse(uid, out var idNum) ? idNum : (int?)null;
        if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();

        var data = await _svc.GetCasesForUserAsync(userID ?? 0, page, pageSize, status, ct);
        return Ok(data);
    }

    // ------------------------------
    // GetById
    // ------------------------------
    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<object>> GetById(Guid id, CancellationToken ct)
    {
        var uid = GetUserId();
        var userID = int.TryParse(uid, out var idNum) ? idNum : (int?)null;
        if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();

        var data = await _db.ValuationCases
            .Include(x => x.Contact)
            .Include(x => x.Request).ThenInclude(r => r.Spec)
            .Include(x => x.Result)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (data is null) return NotFound();
        if (!User.IsInRole("Admin") && !User.IsInRole("ConsultingStaff") && !User.IsInRole("ValuationStaff") && data.UserId != userID)
            return Forbid();

        return Ok(data);
    }

    // ------------------------------
    // UpdateStatus / Assign (chuẩn hoá Roles)
    // ------------------------------
    [Authorize(Roles = "Admin,ConsultingStaff,ValuationStaff")]
    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateCaseStatusDto body, CancellationToken ct)
    {
        if (body is null || string.IsNullOrWhiteSpace(body.Status))
            return BadRequest("Missing status");
        if (!Enum.TryParse<CaseStatus>(body.Status, true, out var st))
            return BadRequest("Invalid status");

        var ok = await _svc.UpdateStatusAsync(id, st, ct);
        return ok ? NoContent() : NotFound();
    }

    [Authorize(Roles = "Admin,ValuationStaff,ConsultingStaff")]
    [HttpPut("{id:guid}/assign")]
    public async Task<IActionResult> Assign(Guid id, [FromBody] AssignCaseDto body, CancellationToken ct)
    {
        if (body is null || body.AssigneeId <= 0)
            return BadRequest("Invalid assignee");

        var ok = await _svc.AssignAsync(id, body.AssigneeId, body.AssigneeName, ct);
        return ok ? NoContent() : NotFound();
    }
    
    [Authorize(Roles = "Admin,ValuationStaff,ConsultingStaff")]
    [HttpPut("{id:guid}/assign/valuation")]
    public async Task<IActionResult> AssignValuation(Guid id, [FromBody] AssignValuationDto body, CancellationToken ct)
    {
        if (body is null || body.ValuationId <= 0)
            return BadRequest("Invalid assignee");

        var ok = await _svc.AssignAsync(id, body.ValuationId, body.ValuationName, ct);
        return ok ? NoContent() : NotFound();
    }

    // ------------------------------
    // UNASSIGNED
    // ------------------------------
    [Authorize(Roles = "Admin,ConsultingStaff,ValuationStaff")]
    [HttpGet("unassigned")]
    public async Task<IActionResult> GetUnassigned(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        var q = _db.ValuationCases
            .AsNoTracking()
            .Where(v => v.AssigneeId == null);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<CaseStatus>(status, true, out var st))
            q = q.Where(v => v.Status == st);

        var total = await q.CountAsync(ct);

        var items = await q
            .OrderByDescending(v => v.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new CaseListItemDto(
                v.Id,
                v.Status.ToString(),
                MapProgress(v.Status),
                v.AssigneeName,
                v.ValuationName,
                v.EstimatedValue,
                v.CreatedAt,
                // Contact
                new MiniContactDto(
                    v.Contact != null ? v.Contact.FullName : null,
                    v.Contact != null ? v.Contact.Email : null,
                    v.Contact != null ? v.Contact.Phone : null,
                    v.Contact != null ? v.Contact.UserId : null
                ),
                // Diamond (từ Request.Spec)
                new MiniDiamondDto(
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Origin : null,
                    v.Request != null && v.Request.Spec != null ? (decimal?)v.Request.Spec.Carat : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Color : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Shape : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Clarity : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Cut : null
                )
            ))
            .ToListAsync(ct);

        return Ok(new PagedResult<CaseListItemDto>(items, page, pageSize, total));
    }

    // ------------------------------
    // ASSIGNED-TO-ME (đã project Contact + Diamond)
    // ------------------------------
    [Authorize(Roles = "Admin,ConsultingStaff,ValuationStaff")]
    [HttpGet("assigned-to-me")]
    public async Task<IActionResult> GetAssignedToMe(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        var uid = GetUserId();
        if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();
        if (!int.TryParse(uid, out var staffId)) return Unauthorized("Invalid uid");

        var q = _db.ValuationCases
            .AsNoTracking()
            .Where(v => v.AssigneeId == staffId);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<CaseStatus>(status, true, out var st))
            q = q.Where(v => v.Status == st);

        var total = await q.CountAsync(ct);

        var items = await q
            .OrderByDescending(v => v.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new CaseListItemDto(
                v.Id,
                v.Status.ToString(),
                MapProgress(v.Status),
                v.AssigneeName,
                v.ValuationName,
                v.EstimatedValue,
                v.CreatedAt,
                new MiniContactDto(
                    v.Contact != null ? v.Contact.FullName : null,
                    v.Contact != null ? v.Contact.Email : null,
                    v.Contact != null ? v.Contact.Phone : null,
                    v.Contact != null ? v.Contact.UserId : null
                ),
                new MiniDiamondDto(
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Origin : null,
                    v.Request != null && v.Request.Spec != null ? (decimal?)v.Request.Spec.Carat : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Color : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Shape : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Clarity : null,
                    v.Request != null && v.Request.Spec != null ? v.Request.Spec.Cut : null
                )
            ))
            .ToListAsync(ct);

        return Ok(new PagedResult<CaseListItemDto>(items, page, pageSize, total));
    }

    // ------------------------------
    // CLAIM / RELEASE
    // ------------------------------
    [Authorize(Roles = "ConsultingStaff,ValuationStaff,Admin")]
    [HttpPost("{id:guid}/claim")]
    public async Task<IActionResult> Claim(Guid id, CancellationToken ct)
    {
        var uid = GetUserId();
        if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();
        if (!int.TryParse(uid, out var staffId)) return Unauthorized("Invalid uid");

        var staffName = User.Identity?.Name;

        var rows = await _db.Database.ExecuteSqlInterpolatedAsync($@"
            UPDATE ValuationCases
            SET AssigneeId   = {staffId},
                AssigneeName = {staffName}
            WHERE Id = {id} AND AssigneeId IS NULL
        ", ct);

        if (rows == 0) return Conflict("Case đã được người khác nhận trước.");
        return NoContent();
    }

    [Authorize(Roles = "ConsultingStaff,ValuationStaff,Admin")]
    [HttpPost("{id:guid}/claim/valuation")]
    public async Task<IActionResult> ClaimValuation(Guid id, CancellationToken ct)
    {
        var uid = GetUserId();
        if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();
        if (!int.TryParse(uid, out var staffId)) return Unauthorized("Invalid uid");

        var staffName = User.Identity?.Name;

        var rows = await _db.Database.ExecuteSqlInterpolatedAsync($@"
            UPDATE ValuationCases
            SET ValuationId   = {staffId},
                ValuationName = {staffName}
            WHERE Id = {id} AND ValuationId IS NULL
        ", ct);

        if (rows == 0) return Conflict("Case đã được người khác nhận trước.");
        return NoContent();
    }

    [Authorize(Roles = "ValuationStaff,ConsultingStaff,Admin")]
    [HttpPost("{id:guid}/release")]
    public async Task<IActionResult> Release(Guid id, CancellationToken ct)
    {
        var uid = GetUserId();
        if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();
        if (!int.TryParse(uid, out var staffId)) return Unauthorized("Invalid uid");

        var rows = await _db.Database.ExecuteSqlInterpolatedAsync($@"
            UPDATE ValuationCases
            SET AssigneeId = NULL,
                AssigneeName = NULL
            WHERE Id = {id} AND AssigneeId = {staffId}
        ", ct);

        if (rows == 0) return Forbid(); // không phải case của bạn
        return NoContent();
    }

    [Authorize(Roles = "ConsultingStaff,ValuationStaff,Admin")]
    [HttpPost("{id:guid}/release/valuation")]
    public async Task<IActionResult> ReleaseValuation(Guid id, CancellationToken ct)
    {
        var uid = GetUserId();
        if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();
        if (!int.TryParse(uid, out var staffId)) return Unauthorized("Invalid uid");

        var rows = await _db.Database.ExecuteSqlInterpolatedAsync($@"
        UPDATE ValuationCases
        SET ValuationId = NULL,
            ValuationName = NULL
        WHERE Id = {id} AND ValuationId = {staffId}
    ", ct);

        if (rows == 0) return Forbid();
        return NoContent();
    }

    [Authorize(Roles = "Admin,ConsultingStaff,ValuationStaff")]
    [HttpPost("{id:guid}/contact-log")]
    public async Task<IActionResult> AddContactLog(Guid id, [FromBody] CreateContactLogDto dto, CancellationToken ct)
    {
        var uid = GetUserId(); if (!int.TryParse(uid, out var staffId)) return Unauthorized();
        var exists = await _db.ValuationCases.AnyAsync(x => x.Id == id, ct);
        if (!exists) return NotFound();

        var log = new ContactLog
        {
            CaseId = id,
            Channel = dto.Channel,
            Outcome = dto.Outcome,
            Note = dto.Note,
            NextFollowUpAt = dto.NextFollowUpAt,
            CreatedBy = staffId
        };
        _db.Add(log);
        await _db.SaveChangesAsync(ct);
        return Created($"/api/cases/{id}/contact-log/{log.Id}", new { log.Id });
    }

    [Authorize(Roles = "ConsultingStaff,Admin,ValuationStaff")]
    [HttpGet("{id:guid}/contact-log")]
    public async Task<IActionResult> GetContactLogs(Guid id, CancellationToken ct)
    {
        var items = await _db.Set<ContactLog>()
            .Where(x => x.CaseId == id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new {
                x.Id,
                x.Channel,
                x.Outcome,
                x.Note,
                x.NextFollowUpAt,
                x.CreatedAt
            })
            .ToListAsync(ct);
        return Ok(items);
    }
}
