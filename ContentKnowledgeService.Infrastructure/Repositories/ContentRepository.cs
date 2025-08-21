using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;
using ContentKnowledgeService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ContentKnowledgeService.Infrastructure.Repositories;

public class ContentRepository : IContentRepository
{
    private readonly AppDbContext _db;
    public ContentRepository(AppDbContext db) => _db = db;

    public async Task<Content> AddAsync(Content entity, CancellationToken ct = default)
    {
        _db.Contents.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var found = await _db.Contents.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (found is null) return false;
        _db.Contents.Remove(found);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<IEnumerable<Content>> GetAllAsync(CancellationToken ct = default)
        => await _db.Contents.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync(ct);

    public async Task<Content?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _db.Contents.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<bool> UpdateAsync(Content entity, CancellationToken ct = default)
    {
        var exists = await _db.Contents.AnyAsync(x => x.Id == entity.Id, ct);
        if (!exists) return false;
        _db.Contents.Update(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
