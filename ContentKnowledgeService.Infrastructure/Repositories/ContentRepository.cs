using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;
using ContentKnowledgeService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ContentKnowledgeService.Infrastructure.Repositories;

public class ContentRepository : IContentRepository
{
    private readonly AppDbContext _db;
    public ContentRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Content>> GetAllAsync()
        => await _db.Contents.Include(x => x.Category).OrderByDescending(x => x.CreatedAt).ToListAsync();

    public async Task<Content?> GetByIdAsync(Guid id)
        => await _db.Contents.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);

    public async Task AddAsync(Content entity)
    {
        await _db.Contents.AddAsync(entity);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Content entity)
    {
        _db.Contents.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Content entity)
    {
        _db.Contents.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
