using Inventory.Domain.Entities;
using Inventory.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;

    public InventoryController(IInventoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{sku}")]
    public async Task<IActionResult> GetBySku(string sku)
    {
        var item = await _service.GetBySkuAsync(sku);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] InventoryItem item)
    {
        await _service.AddAsync(item);
        return CreatedAtAction(nameof(GetBySku), new { sku = item.SKU }, item);
    }

    [HttpPut("{sku}")]
    public async Task<IActionResult> Update(string sku, [FromBody] InventoryItem updated)
    {
        var existing = await _service.GetBySkuAsync(sku);
        if (existing == null) return NotFound();

        existing.Quantity = updated.Quantity;
        existing.Location = updated.Location;
        await _service.UpdateAsync(existing);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
