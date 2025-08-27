using Microsoft.EntityFrameworkCore;
using ValuationRespon.Domain.Entities;
using ValuationRespon.Application.Interfaces;
using ValuationRespon.Infrastructure.Data;

namespace ValuationRespon.Infrastructure.Repositories
{
    public class ValuationCaseRepository : IValuationCaseRepository
    {
        private readonly ValuationResponDbContext _db;

        public ValuationCaseRepository(ValuationResponDbContext db) => _db = db;

        public async Task<ValuationCase> AddCaseAsync(ValuationCase entity)
        {
            _db.ValuationCases.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ValuationCase?> GetCaseAsync(Guid id)
        {
            return await _db.ValuationCases.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task UpdateCaseAsync(ValuationCase entity)
        {
            _db.ValuationCases.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<ValuationTimeline> AddTimelineAsync(ValuationTimeline tl)
        {
            _db.ValuationTimelines.Add(tl);
            await _db.SaveChangesAsync();
            return tl;
        }

        public async Task<ValuationResult> AddResultAsync(ValuationResult result)
        {
            _db.ValuationResults.Add(result);
            await _db.SaveChangesAsync();
            return result;
        }
    }
}
