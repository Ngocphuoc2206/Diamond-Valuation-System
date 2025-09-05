using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Api.Controllers;

[ApiController]
[Route("api/cases")]
[Produces("application/json")]
public class CasesController : ControllerBase
{
    private readonly ICaseService _svc;
    private readonly AppDbContext _db;
    public CasesController(ICaseService svc, AppDbContext db)
    {
        _svc = svc;
        _db = db;
    }

    // 1) User gửi request valuation
    [HttpPost]
    public async Task<ActionResult<CreateCaseResponseDto>> Create([FromBody] CreateCaseRequestDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var res = await _svc.CreateAsync(dto, ct);
        // trả 201 kèm link GET /api/cases/{id}
        return CreatedAtAction(nameof(GetById), new { id = res.CaseId }, res);
    }

    // 2) Lấy chi tiết hồ sơ (để FE hiển thị)
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<object>> GetById(Guid id, CancellationToken ct)
    {
        var data = await _db.ValuationCases
            .Include(x => x.Contact)
            .Include(x => x.Request).ThenInclude(r => r.Spec)
            .Include(x => x.Result)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        return data is null ? NotFound() : Ok(data);
    }

    // 3) (tuỳ chọn) cập nhật trạng thái – dành cho staff/admin
    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateCaseStatusDto body, CancellationToken ct)
    {
        if (body is null || string.IsNullOrWhiteSpace(body.Status))
            return BadRequest("Missing status");

        if (!Enum.TryParse<CaseStatus>(body.Status, ignoreCase: true, out var st))
            return BadRequest("Invalid status");

        var ok = await _svc.UpdateStatusAsync(id, st, ct);
        return ok ? NoContent() : NotFound();
    }
}
