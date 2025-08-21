using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;
using ContentKnowledgeService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ContentKnowledgeService.Infrastructure.Repositories;

public class KnowledgeRepository : IKnowledgeRepository
{
    private readonly AppDbContext _db;
    public KnowledgeRepository(AppDbContext db) => _db = db;

    public async Task<Knowledge> AddAsync(Knowledge entity, CancellationToken ct = default)
    {
        _db.Knowledges.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var found = await _db.Knowledges.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (found is null) return false;
        _db.Knowledges.Remove(found);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<IEnumerable<Knowledge>> GetAllAsync(CancellationToken ct = default)
        => await _db.Knowledges.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync(ct);

    public async Task<Knowledge?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _db.Knowledges.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<bool> UpdateAsync(Knowledge entity, CancellationToken ct = default)
    {
        var exists = await _db.Knowledges.AnyAsync(x => x.Id == entity.Id, ct);
        if (!exists) return false;
        _db.Knowledges.Update(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
