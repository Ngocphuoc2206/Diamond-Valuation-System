using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pricing.Application.DTOs;
using Pricing.Application.Services.Interfaces;

namespace Pricing.Api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/pricing")]
public class PricingController : ControllerBase
{
    private readonly IPricingService _svc;
    public PricingController(IPricingService svc) => _svc = svc;

    // Lấy giá hiệu lực 1 SKU
    [AllowAnonymous, HttpGet("effective")]
    public async Task<IActionResult> GetEffective([FromQuery] string sku, [FromQuery] string? listCode, [FromQuery] string? customerGroup)
        => Ok(await _svc.GetEffectiveAsync(new GetEffectivePriceQuery(sku, listCode, customerGroup, null)));

    // Bulk (nhiều SKU)
    [AllowAnonymous, HttpPost("effective/bulk")]
    public async Task<IActionResult> Bulk([FromBody] IEnumerable<GetEffectivePriceQuery> queries)
        => Ok(await _svc.BulkGetEffectiveAsync(queries));

    // Upsert price
    [Authorize(Roles = "Admin,Manager"), HttpPost("upsert")]
    public async Task<IActionResult> Upsert([FromBody] PriceUpsertDto dto)
        => Ok(await _svc.UpsertAsync(dto));
}
