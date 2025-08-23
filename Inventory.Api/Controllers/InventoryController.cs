using Inventory.Application.DTOs;
using Inventory.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1.0/inventory")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _svc;
    public InventoryController(IInventoryService svc) => _svc = svc;

    [HttpGet("{sku}")]
    public async Task<IActionResult> Get(string sku)
    {
        var it = await _svc.GetAsync(sku);
        return it is null ? NotFound() : Ok(it);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _svc.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Upsert(CreateOrUpdateInventoryItemDto dto)
        => Ok(await _svc.UpsertAsync(dto));

    [HttpPatch("{sku}/adjust")]
    public async Task<IActionResult> Adjust(string sku, [FromBody] int delta)
        => Ok(await _svc.AdjustQuantityAsync(sku, delta));

    [HttpDelete("{sku}")]
    public async Task<IActionResult> Delete(string sku)
        => Ok(await _svc.DeleteAsync(sku));
}
