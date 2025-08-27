using Microsoft.AspNetCore.Mvc;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CasesController : ControllerBase
    {
        private readonly IValuationCaseService _service;
        public CasesController(IValuationCaseService service) => _service = service;

        /// <summary>
        /// 1. Customer gửi yêu cầu định giá
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ValuationCase request)
        {
            var result = await _service.CreateCaseAsync(request);
            return Ok(new
            {
                Message = "Case created successfully",
                CaseId = result.Id,
                Status = result.Status
            });
        }

        /// <summary>
        /// 2. Consultant cập nhật timeline
        /// </summary>
        [HttpPost("{id}/timeline")]
        public async Task<IActionResult> AddTimeline(Guid id, [FromBody] ValuationTimeline timeline)
        {
            var result = await _service.AddTimelineAsync(id, timeline);
            return Ok(new
            {
                Message = "Timeline updated successfully",
                Step = result.Step,
                Note = result.Note,
                Time = result.Timestamp
            });
        }

        /// <summary>
        /// 3. Valuer hoàn tất định giá
        /// </summary>
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> Complete(Guid id, [FromBody] ValuationResult result)
        {
            var r = await _service.CompleteValuationAsync(id, result);
            return Ok(new
            {
                Message = "Valuation completed",
                MarketValue = r.MarketValue,
                InsuranceValue = r.InsuranceValue,
                RetailValue = r.RetailValue,
                CompletedAt = r.CompletedAt
            });
        }
    }
}
