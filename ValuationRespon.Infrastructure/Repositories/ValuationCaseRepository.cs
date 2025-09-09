using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Domain.Entities;
using ValuationRespon.Infrastructure.Data;

namespace ValuationRespon.Infrastructure.Repositories
{
    public class ValuationCaseRepository : IValuationCaseRepository
    {
        private readonly ValuationResponDbContext _db;

        public ValuationCaseRepository(ValuationResponDbContext db) => _db = db;

        // ========= CASE =========

        // EF-backed query để service dùng .Where/.Select (có thể truy cập x.Result, x.Timelines do đã khai báo navigation)
        public IQueryable<ValuationCase> CasesAsQueryable()
            => _db.ValuationCases.AsQueryable(); // nếu muốn tăng tốc: .AsNoTracking()

        public async Task<ValuationCase> AddCaseAsync(ValuationCase entity, CancellationToken ct = default)
        {
            await _db.ValuationCases.AddAsync(entity, ct);
            await _db.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<ValuationCase?> GetCaseAsync(Guid id, CancellationToken ct = default)
        {
            // Nếu cần kèm Result/Timelines khi đọc chi tiết:
            // return await _db.ValuationCases
            //     .Include(c => c.Result)
            //     .Include(c => c.Timelines)
            //     .FirstOrDefaultAsync(x => x.Id == id, ct);

            return await _db.ValuationCases.FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task<ValuationCase> UpdateCaseAsync(ValuationCase entity, CancellationToken ct = default)
        {
            _db.Entry(entity).State = EntityState.Modified;
            await _db.SaveChangesAsync(ct);
            return entity;
        }

        // ========= TIMELINE =========

        public async Task<IReadOnlyList<ValuationTimeline>> GetTimelinesByCaseAsync(Guid caseId, CancellationToken ct = default)
        {
            return await _db.ValuationTimelines
                .Where(t => t.ValuationCaseId == caseId)
                .OrderBy(t => t.Timestamp)
                .ToListAsync(ct);
        }

        public async Task<ValuationTimeline> AddTimelineAsync(ValuationTimeline tl, CancellationToken ct = default)
        {
            await _db.ValuationTimelines.AddAsync(tl, ct);
            await _db.SaveChangesAsync(ct);
            return tl;
        }

        // ========= RESULT =========

        public async Task<ValuationResult?> GetResultByCaseAsync(Guid caseId, CancellationToken ct = default)
        {
            return await _db.ValuationResults
                .FirstOrDefaultAsync(r => r.ValuationCaseId == caseId, ct);
        }

        public async Task<ValuationResult> AddResultAsync(ValuationResult result, CancellationToken ct = default)
        {
            await _db.ValuationResults.AddAsync(result, ct);
            await _db.SaveChangesAsync(ct);
            return result;
        }

        public async Task<ValuationResult> UpdateResultAsync(ValuationResult result, CancellationToken ct = default)
        {
            _db.Entry(result).State = EntityState.Modified;
            await _db.SaveChangesAsync(ct);
            return result;
        }
    }
}
