using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore; // CountAsync, ToListAsync
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Domain.Entities;

namespace ValuationRespon.Application.Services
{
    public class ValuationCaseService : IValuationCaseService
    {
        private readonly IValuationCaseRepository _repo;
        private readonly IEmailService _emailService;

        public ValuationCaseService(IValuationCaseRepository repo, IEmailService emailService)
        {
            _repo = repo;
            _emailService = emailService;
        }

        // ================= CASE =================
        public async Task<ValuationCase> CreateCaseAsync(ValuationCase request, CancellationToken ct = default)
        {
            request.Id = request.Id == Guid.Empty ? Guid.NewGuid() : request.Id;
            request.FullName = request.FullName?.Trim() ?? string.Empty;
            request.Email = request.Email?.Trim() ?? string.Empty;
            request.Phone = request.Phone?.Trim() ?? string.Empty;
            request.Status = string.IsNullOrWhiteSpace(request.Status) ? "Pending" : request.Status.Trim();
            return await _repo.AddCaseAsync(request, ct);
        }

        public async Task<ValuationCase?> GetCaseAsync(Guid id, CancellationToken ct = default)
            => await _repo.GetCaseAsync(id, ct);

        public async Task<(int total, IEnumerable<object> items)> GetAllAsync(
            int page, int pageSize, string? status, CancellationToken ct = default)
        {
            if (page < 1) page = 1;
            if (pageSize <= 0 || pageSize > 100) pageSize = 10;

            var q = _repo.CasesAsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                var s = status.Trim();
                q = q.Where(x => x.Status == s);
            }

            var total = await q.CountAsync(ct);

            var items = await q
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new
                {
                    x.Id,
                    x.Status,
                    x.CreatedAt,
                    x.UpdatedAt,
                    x.FullName,
                    x.Email,
                    x.AssigneeId,
                    x.AssigneeName,
                    ResultSummary = x.Result == null ? null : new
                    {
                        x.Result.MarketValue,
                        x.Result.RetailValue
                    }
                })
                .ToListAsync(ct);

            return (total, items);
        }

        // ================= TIMELINE =================
        public async Task<IReadOnlyList<ValuationTimeline>> GetTimelineAsync(Guid caseId, CancellationToken ct = default)
            => await _repo.GetTimelinesByCaseAsync(caseId, ct);

        public async Task<ValuationTimeline> AddTimelineAsync(Guid caseId, ValuationTimeline timeline, CancellationToken ct = default)
        {
            timeline.Id = timeline.Id == Guid.Empty ? Guid.NewGuid() : timeline.Id;
            timeline.ValuationCaseId = caseId;
            timeline.Step = (timeline.Step ?? string.Empty).Trim();
            timeline.Note = (timeline.Note ?? string.Empty).Trim();
            if (timeline.Timestamp == default) timeline.Timestamp = DateTime.UtcNow;

            var tl = await _repo.AddTimelineAsync(timeline, ct);

            var vc = await _repo.GetCaseAsync(caseId, ct);
            if (vc != null)
            {
                if (string.Equals(timeline.Step, "Valuation", StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(vc.Status, "Completed", StringComparison.OrdinalIgnoreCase))
                {
                    vc.Status = "InProgress";
                    vc.UpdatedAt = DateTime.UtcNow;
                    await _repo.UpdateCaseAsync(vc, ct);
                }
            }

            return tl;
        }

        // ================= RESULT =================
        public async Task<ValuationResult?> GetResultAsync(Guid caseId, CancellationToken ct = default)
            => await _repo.GetResultByCaseAsync(caseId, ct);

        public async Task<ValuationResult> CompleteValuationAsync(Guid caseId, ValuationResult result, CancellationToken ct = default)
        {
            // Upsert kết quả
            var existing = await _repo.GetResultByCaseAsync(caseId, ct);

            ValuationResult saved;
            if (existing == null)
            {
                result.Id = result.Id == Guid.Empty ? Guid.NewGuid() : result.Id;
                result.ValuationCaseId = caseId;
                if (result.CompletedAt == default) result.CompletedAt = DateTime.UtcNow;

                saved = await _repo.AddResultAsync(result, ct);
            }
            else
            {
                existing.MarketValue = result.MarketValue;
                existing.InsuranceValue = result.InsuranceValue;
                existing.RetailValue = result.RetailValue;
                existing.Condition = result.Condition;
                existing.Certification = result.Certification;
                existing.Notes = result.Notes;
                existing.CompletedAt = DateTime.UtcNow;

                saved = await _repo.UpdateResultAsync(existing, ct);
            }

            // Cập nhật Case → Completed + thêm timeline "ResultPrepared"
            var vc = await _repo.GetCaseAsync(caseId, ct);
            if (vc != null)
            {
                vc.Status = "Completed";
                vc.UpdatedAt = DateTime.UtcNow;
                await _repo.UpdateCaseAsync(vc, ct);

                await _repo.AddTimelineAsync(new ValuationTimeline
                {
                    Id = Guid.NewGuid(),
                    ValuationCaseId = caseId,
                    Step = "ResultPrepared",
                    Note = "Kết quả định giá đã sẵn sàng.",
                    Timestamp = DateTime.UtcNow
                }, ct);

                // Email cho khách
                if (!string.IsNullOrWhiteSpace(vc.Email))
                {
                    var subject = "Kết quả định giá kim cương của bạn";
                    var body = $@"
                        Xin chào {vc.FullName},<br/><br/>
                        Kết quả định giá đã hoàn tất:<br/>
                        - Giá trị thị trường: {saved.MarketValue:N2} $<br/>
                        - Giá trị bảo hiểm: {saved.InsuranceValue:N2} $<br/>
                        - Giá trị bán lẻ: {saved.RetailValue:N2} $<br/><br/>
                        Ghi chú: {saved.Notes}<br/><br/>
                        Trân trọng,<br/>Diamond Valuation Team
                    ";
                    await _emailService.SendEmailAsync(vc.Email, subject, body);
                }
            }

            return saved;
        }

        // ================= ASSIGNEE & STATUS =================
        public async Task<bool> AssignAsync(Guid caseId, Guid assigneeId, string? assigneeName, CancellationToken ct = default)
        {
            var vc = await _repo.GetCaseAsync(caseId, ct);
            if (vc == null) return false;

            vc.AssigneeId = assigneeId;
            vc.AssigneeName = (assigneeName ?? string.Empty).Trim();
            if (!string.Equals(vc.Status, "Completed", StringComparison.OrdinalIgnoreCase))
                vc.Status = "InProgress";

            vc.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateCaseAsync(vc, ct);

            await _repo.AddTimelineAsync(new ValuationTimeline
            {
                Id = Guid.NewGuid(),
                ValuationCaseId = caseId,
                Step = "Assigned",
                Note = $"Gán cho {vc.AssigneeName} ({vc.AssigneeId}).",
                Timestamp = DateTime.UtcNow
            }, ct);

            return true;
        }

        public async Task<bool> UpdateStatusAsync(Guid caseId, string status, CancellationToken ct = default)
        {
            var s = (status ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(s)) return false;

            var vc = await _repo.GetCaseAsync(caseId, ct);
            if (vc == null) return false;

            vc.Status = s;
            vc.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateCaseAsync(vc, ct);

            await _repo.AddTimelineAsync(new ValuationTimeline
            {
                Id = Guid.NewGuid(),
                ValuationCaseId = caseId,
                Step = "StatusChanged",
                Note = $"Chuyển trạng thái => {s}",
                Timestamp = DateTime.UtcNow
            }, ct);

            return true;
        }
    }
}
