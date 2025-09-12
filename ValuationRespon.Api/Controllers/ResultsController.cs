using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ValuationRespon.Application.DTOs;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Domain.Entities;
using ValuationRespon.Infrastructure.Data;

namespace ValuationRespon.Api.Controllers
{
    [ApiController]
    [Route("api/results")]
    [Produces("application/json")]
    public class ResultsController : ControllerBase
    {
        private readonly ValuationResponDbContext _db;
        private readonly ICaseStatusClient _caseClient;
        private readonly ILogger<ResultsController> _logger;
        private readonly IEmailService _mail;
        private readonly ICaseQueryClient _caseQuery;
        private readonly ICaseStatusClient _caseStatus;

        public ResultsController(
            ValuationResponDbContext db,
            ICaseStatusClient caseClient,
            ILogger<ResultsController> logger,
            IEmailService emailService, 
            ICaseQueryClient caseQueryClient,
            ICaseStatusClient caseStatusClient)
        {
            _db = db;
            _caseClient = caseClient;
            _logger = logger;
            _mail = emailService;
            _caseQuery = caseQueryClient;
            _caseStatus = caseStatusClient;
        }

        private string? GetUserId()
        {
            var sub = User.Claims.FirstOrDefault(c =>
                c.Type == "uid" || c.Type == ClaimTypes.NameIdentifier || c.Type == "sub")?.Value;

            foreach (var claim in User.Claims)
                _logger.LogInformation("Claim: {Type} = {Value}", claim.Type, claim.Value);

            return string.IsNullOrWhiteSpace(sub) ? null : sub;
        }

        /// <summary>Upsert kết quả cho một case</summary>
        [HttpPost]
        public async Task<ActionResult> Upsert([FromBody] ResultUpsertDto dto, CancellationToken ct)
        {

            var existed = await _db.ValuationResults.FirstOrDefaultAsync(r => r.RequestId == dto.RequestId, ct);
            if (existed != null)
            {
                return Ok(new { sent = false, alreadyCompleted = true, resultId = existed.Id });
            }
            var uid = GetUserId();
            if (string.IsNullOrWhiteSpace(uid)) return Unauthorized();
            if (!int.TryParse(uid, out var staffId)) return Unauthorized("Invalid uid");
            var staffName = User.Identity?.Name;

            var entity = new ValuationResult
            {
                Id = Guid.NewGuid(),
                CaseId = dto.CaseId,
                RequestId = dto.RequestId,
                CertificateNo = dto.CertificateNo,
                ValuationId = staffId,
                ValuationName = staffName,
                PricePerCarat = dto.PricePerCarat,
                TotalPrice = dto.TotalPrice,
                Currency = dto.Currency,
                AlgorithmVersion = dto.AlgorithmVersion,
                ValuatedAt = dto.ValuatedAt,
                CustomerName = dto.CustomerName
            };

            await _db.ValuationResults.AddAsync(entity, ct);
            await _db.SaveChangesAsync(ct);

            // 2) Callback về RequestService:
            try
            {
                // a) cập nhật các field giá trị
                await _caseClient.UpdateResultAsync(dto.CaseId, dto.PricePerCarat, dto.TotalPrice, dto.Currency, dto.AlgorithmVersion, dto.ValuatedAt, ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UpdateResultAsync failed for case {CaseId}", dto.CaseId);
            }

            try
            {
                // b) đẩy trạng thái sang KetQua (85%)
                await _caseClient.UpdateStatusAsync(dto.CaseId, "KetQua", ct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "UpdateStatusAsync failed for case {CaseId}", dto.CaseId);
            }

            return Ok(new
            {
                resultId = entity.Id,
                totalPrice = entity.TotalPrice,
                currency = entity.Currency
            });
        }
        [AllowAnonymous]
        [HttpPost("{caseId:guid}/complete")]
        public async Task<IActionResult> Complete(Guid caseId, [FromBody] CompleteRequest body, CancellationToken ct)
        {
            _logger.LogInformation($"Email: {body.Email}");
            if (string.IsNullOrWhiteSpace(body.Email))
                return Problem("Thiếu email khách hàng", statusCode: 400);

            var subject = $"Kết quả định giá kim cương – Mã hồ sơ {caseId.ToString()[..8]}";
            var html = $@"
        <p>Chào {System.Net.WebUtility.HtmlEncode(body.CustomerName ?? "quý khách")},</p>
        <p>Kết quả định giá cho hồ sơ <b>{caseId}</b> đã hoàn tất.</p>
        <ul>
          <li>Giá ước tính: <b>{body.TotalPrice?.ToString("N0")} {body.Currency ?? "USD"}</b></li>
          {(string.IsNullOrWhiteSpace(body.Notes) ? "" : $"<li>Ghi chú: {System.Net.WebUtility.HtmlEncode(body.Notes!)}</li>")}
        </ul>
        <p>Trân trọng,<br>Diamond Valuations</p>";

            await _mail.SendAsync(body.Email!, subject, html, ct);

            await _caseStatus.UpdateStatusAsync(caseId, "Complete", ct);

            return Ok(new { sent = true });
        }

        public class CompleteRequest
        {
            public decimal? TotalPrice { get; set; }
            public string? Currency { get; set; } = "USD";
            public string? Notes { get; set; }

            public string? CustomerName { get; set; }
            public string? Email { get; set; }

        }
    }
}
