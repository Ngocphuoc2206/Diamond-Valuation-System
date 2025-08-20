using ContentKnowledgeService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ContentKnowledgeService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ValuationGuideController : ControllerBase
{
    private readonly IKnowledgeService _service;
    public ValuationGuideController(IKnowledgeService service) => _service = service;

    // Dùng Knowledge nhưng filter theo CategoryName = "ValuationGuide"
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok((await _service.GetAllAsync()).Where(x => x.CategoryName == "ValuationGuide"));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _service.GetByIdAsync(id);
        if (item == null || item.CategoryName != "ValuationGuide") return NotFound();
        return Ok(item);
    }
}
