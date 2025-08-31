using InvoiceService.Application.DTOs;
using InvoiceService.Application.Interfaces;
using InvoiceService.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using SharedLibrary.Response;

namespace InvoiceService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReceiptsController : ControllerBase
{
    private readonly IReceiptService _svc;
    public ReceiptsController(IReceiptService svc) => _svc = svc;

    /// <summary>Create valuation receipt</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ReceiptResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateReceiptRequest request, CancellationToken ct)
    {
        var data = await _svc.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = data.Id }, ApiResponse<ReceiptResponse>.Ok(data, "Created"));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ReceiptResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var data = await _svc.GetAsync(id, ct);
        return data is null
            ? NotFound(ApiResponse<ReceiptResponse>.Fail("Not found"))
            : Ok(ApiResponse<ReceiptResponse>.Ok(data));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search(
        [FromQuery] string? receiptNo, [FromQuery] DateOnly? from, [FromQuery] DateOnly? to,
        [FromQuery] Guid? appraiserId, [FromQuery] ReceiptStatus? status,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var (items, total) = await _svc.SearchAsync(receiptNo, from, to, appraiserId, status, page, pageSize, ct);
        return Ok(ApiResponse<object>.Ok(new { total, items }));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ReceiptResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateReceiptRequest request, CancellationToken ct)
    {
        var data = await _svc.UpdateAsync(id, request, ct);
        return Ok(ApiResponse<ReceiptResponse>.Ok(data, "Updated"));
    }

    [HttpPost("{id:guid}:cancel")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Cancel(Guid id, CancellationToken ct)
    {
        await _svc.CancelAsync(id, ct);
        return Ok(ApiResponse<string>.Ok("Cancelled"));
    }
}
