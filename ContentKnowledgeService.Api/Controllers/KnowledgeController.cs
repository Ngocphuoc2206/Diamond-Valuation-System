using Microsoft.AspNetCore.Mvc;
using ContentKnowledgeService.Application.DTOs;
using ContentKnowledgeService.Application.Interfaces;

namespace ContentKnowledgeService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KnowledgeController : ControllerBase
    {
        private readonly IKnowledgeService _knowledgeService;

        public KnowledgeController(IKnowledgeService knowledgeService)
        {
            _knowledgeService = knowledgeService;
        }

        // GET: api/knowledge
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _knowledgeService.GetAllAsync();
            return Ok(result);
        }

        // GET: api/knowledge/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _knowledgeService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST: api/knowledge
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] KnowledgeRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _knowledgeService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT: api/knowledge/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] KnowledgeRequest request)
        {
            var updated = await _knowledgeService.UpdateAsync(id, request);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE: api/knowledge/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _knowledgeService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
