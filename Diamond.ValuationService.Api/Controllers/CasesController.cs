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
        _svc = svc; _db = db; _logger = logger;
    }

    private string? GetUserId()
    {
        var sub = User.Claims.FirstOrDefault(c =>
            c.Type == "uid" || c.Type == ClaimTypes.NameIdentifier || c.Type == "sub")?.Value;

        foreach (var claim in User.Claims)
            _logger.LogInformation("Claim: {Type} = {Value}", claim.Type, claim.Value);

        return string.IsNullOrWhiteSpace(sub) ? null : sub;
    }

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

        // ⬇️ Đổi service để nhận uid dạng string; bên trong gán ValuationCase.CustomerId = uid
        var res = await _svc.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = res.CaseId }, res);
    }

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
        if (!User.IsInRole("Admin") && !User.IsInRole("Staff") && data.UserId != userID)
            return Forbid();

        return Ok(data);
    }

    [Authorize(Roles = "Admin,Staff")]
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
}
