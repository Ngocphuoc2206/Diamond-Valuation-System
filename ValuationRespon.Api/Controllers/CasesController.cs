using Microsoft.AspNetCore.Authorization;
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

        /// <summary>1) Khách hàng gửi yêu cầu định giá</summary>
        [AllowAnonymous] // hoặc dùng [Authorize(Roles = "Customer,Admin,Manager")] nếu bạn muốn hạn chế
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ValuationCase request, CancellationToken ct)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var result = await _service.CreateCaseAsync(request, ct);
            return CreatedAtAction(nameof(GetOne), new { id = result.Id }, new
            {
                message = "Case created successfully",
                caseId = result.Id,
                status = result.Status
            });
        }

        /// <summary>Danh sách case (phân trang + lọc trạng thái)</summary>
        [Authorize(Roles = "Admin,Manager,Consultant,Valuator")]
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null,
            CancellationToken ct = default)
        {
            if (page < 1) page = 1;
            if (pageSize <= 0 || pageSize > 100) pageSize = 10;

            var (total, items) = await _service.GetAllAsync(page, pageSize, status, ct);
            var totalPages = (int)Math.Ceiling((double)total / pageSize);

            return Ok(new { page, pageSize, total, totalPages, items });
        }

        /// <summary>Lấy chi tiết 1 case theo Id</summary>
        [Authorize(Roles = "Admin,Manager,Consultant,Valuator")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetOne([FromRoute] Guid id, CancellationToken ct)
        {
            var item = await _service.GetCaseAsync(id, ct);
            return item is null ? NotFound() : Ok(item);
        }

        /// <summary>Lấy timeline của case</summary>
        [Authorize(Roles = "Admin,Manager,Consultant,Valuator")]
        [HttpGet("{id:guid}/timeline")]
        public async Task<IActionResult> GetTimeline([FromRoute] Guid id, CancellationToken ct)
        {
            var tl = await _service.GetTimelineAsync(id, ct);
            return Ok(tl);
        }

        /// <summary>2) Consultant cập nhật timeline</summary>
        [Authorize(Roles = "Admin,Manager,Consultant,Valuator")]
        [HttpPost("{id:guid}/timeline")]
        public async Task<IActionResult> AddTimeline([FromRoute] Guid id, [FromBody] ValuationTimeline timeline, CancellationToken ct)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var result = await _service.AddTimelineAsync(id, timeline, ct);
            return Ok(new
            {
                message = "Timeline updated successfully",
                step = result.Step,
                note = result.Note,
                time = result.Timestamp
            });
        }

        /// <summary>Gán người xử lý cho case</summary>
        [Authorize(Roles = "Admin,Manager")]
        [HttpPost("{id:guid}/assign")]
        public async Task<IActionResult> Assign([FromRoute] Guid id, [FromBody] AssignCaseDto dto, CancellationToken ct)
        {
            var ok = await _service.AssignAsync(id, dto.AssigneeId, dto.AssigneeName, ct);
            return ok ? NoContent() : NotFound();
        }

        /// <summary>Cập nhật trạng thái case thủ công</summary>
        [Authorize(Roles = "Admin,Manager,Consultant,Valuator")]
        [HttpPost("{id:guid}/status")]
        public async Task<IActionResult> UpdateStatus([FromRoute] Guid id, [FromBody] UpdateStatusDto dto, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Status)) return BadRequest(new { message = "Status is required." });

            var ok = await _service.UpdateStatusAsync(id, dto.Status, ct);
            return ok ? NoContent() : NotFound();
        }

        /// <summary>Lấy kết quả định giá (nếu đã có)</summary>
        [Authorize(Roles = "Admin,Manager,Consultant,Valuator")]
        [HttpGet("{id:guid}/result")]
        public async Task<IActionResult> GetResult([FromRoute] Guid id, CancellationToken ct)
        {
            var r = await _service.GetResultAsync(id, ct);
            return r is null ? NotFound() : Ok(r);
        }

        /// <summary>3) Valuator hoàn tất định giá</summary>
        [Authorize(Roles = "Admin,Manager,Valuator")]
        [HttpPost("{id:guid}/complete")]
        public async Task<IActionResult> Complete([FromRoute] Guid id, [FromBody] ValuationResult result, CancellationToken ct)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var r = await _service.CompleteValuationAsync(id, result, ct);
            return Ok(new
            {
                message = "Valuation completed",
                marketValue = r.MarketValue,
                insuranceValue = r.InsuranceValue,
                retailValue = r.RetailValue,
                completedAt = r.CompletedAt
            });
        }
    }

    // ====== DTOs đơn giản cho assign & status ======
    public class AssignCaseDto
    {
        public Guid AssigneeId { get; set; }
        public string? AssigneeName { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = "InProgress";
    }
}
