using Microsoft.AspNetCore.Mvc;
using Product.Application.DTOs;
using Product.Application.Services;

namespace Product.Api.Controllers;

[ApiController]
[Route("api/catalog")]
public class CatalogController : ControllerBase
{
    private readonly ICatalogService _catalog;

    public CatalogController(ICatalogService catalog) => _catalog = catalog;

    [HttpPost("diamonds")]
    public async Task<ActionResult<DiamondDto>> Create([FromBody] CreateDiamondRequest req, CancellationToken ct)
        => Ok(await _catalog.CreateAsync(req, ct));

    [HttpGet("diamonds/{id:guid}")]
    public async Task<ActionResult<DiamondDto>> Get(Guid id, CancellationToken ct)
    {
        var dto = await _catalog.GetByIdAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("diamonds")]
    public async Task<ActionResult<List<DiamondDto>>> Search([FromQuery] string? shape, [FromQuery] string? color, [FromQuery] string? clarity, [FromQuery] int skip = 0, [FromQuery] int take = 20, CancellationToken ct = default)
        => Ok(await _catalog.SearchAsync(shape, color, clarity, skip, take, ct));
}
