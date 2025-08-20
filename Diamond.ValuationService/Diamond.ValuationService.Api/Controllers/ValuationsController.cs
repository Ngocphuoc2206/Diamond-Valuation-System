using Diamond.ValuationService.Application.DTOs;
using Diamond.ValuationService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Diamond.ValuationService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValuationsController : ControllerBase
{
    private readonly IValuationService _svc;
    public ValuationsController(IValuationService svc) => _svc = svc;

    /// <summary>Ước lượng giá trị kim cương theo tiêu chí đầu vào</summary>
    [HttpPost("estimate")]
    public async Task<ActionResult<EstimateResponseDto>> Estimate([FromBody] EstimateRequestDto dto, CancellationToken ct)
    {
        try
        {
            var res = await _svc.EstimateAsync(dto, ct);
            return Ok(res);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
