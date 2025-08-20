using ContentKnowledgeService.Application.DTOs;
using ContentKnowledgeService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ContentKnowledgeService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContentController : ControllerBase
    {
        private readonly IContentService _service;

        public ContentController(IContentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateContentRequest request)
        {
            var result = await _service.CreateContentAsync(request);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateContentRequest request)
        {
            var result = await _service.UpdateContentAsync(request);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _service.DeleteContentAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}
