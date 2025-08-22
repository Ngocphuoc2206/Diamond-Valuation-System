using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Diamond.ValuationService.Domain.Entities;
using Diamond.ValuationService.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diamond.ValuationService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
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

    /// <summary>Tạo hồ sơ từ bước “Mẫu + Liên hệ”.</summary>
    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(CreateCaseResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateCaseResponseDto>> Create(
        [FromBody] CreateCaseRequestDto dto,
        CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var res = await _svc.CreateAsync(dto, ct);

        // route name khai báo ở GetById
        return CreatedAtRoute("GetCaseById", new { id = res.CaseId }, res);
    }

    /// <summary>Lấy chi tiết case theo Id.</summary>
    [HttpGet("{id:guid}", Name = "GetCaseById")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> GetById(Guid id, CancellationToken ct = default)
    {
        var data = await _db.ValuationCases
            .AsNoTracking()
            .Include(x => x.Contact)
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                Status = x.Status.ToString(),
                x.CertificateNo, x.Origin, x.Shape, x.Carat, x.Color, x.Clarity, x.Cut, x.Polish, x.Symmetry, x.Fluorescence,
                Contact = new
                {
                    x.Contact.FullName,
                    x.Contact.Email,
                    x.Contact.Phone,
                    PreferredContactMethod = x.Contact.PreferredMethod
                }
            })
            .FirstOrDefaultAsync(ct);

        return data is null ? NotFound() : Ok(data);
    }

    /// <summary>Cập nhật trạng thái case.</summary>
    [HttpPatch("{id:guid}/status")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateCaseStatusDto body,
        CancellationToken ct = default)
    {
        if (body is null || string.IsNullOrWhiteSpace(body.Status))
            return BadRequest("Missing status");

        if (!Enum.TryParse<CaseStatus>(body.Status, ignoreCase: true, out var st))
            return BadRequest("Invalid status");

        var ok = await _svc.UpdateStatusAsync(id, st, ct);
        return ok ? NoContent() : NotFound();
    }
}
