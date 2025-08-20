using ContentKnowledgeService.Domain.Entities;
using ContentKnowledgeService.Domain.Interfaces;
using ContentKnowledgeService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ContentKnowledgeService.Infrastructure.Repositories;

public class KnowledgeRepository : IKnowledgeRepository
{
    private readonly AppDbContext _db;
    public KnowledgeRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Knowledge>> GetAllAsync()
        => await _db.Knowledges.Include(x => x.Category).OrderByDescending(x => x.CreatedAt).ToListAsync();

    public async Task<Knowledge?> GetByIdAsync(Guid id)
        => await _db.Knowledges.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);

    public async Task AddAsync(Knowledge entity)
    {
        // Nếu Category chưa tồn tại mà được gán inline (InMemory) thì Add vào trước
        if (entity.Category != null && await _db.Categories.FindAsync(entity.Category.Id) is null)
        {
            await _db.Categories.AddAsync(entity.Category);
        }
        await _db.Knowledges.AddAsync(entity);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Knowledge entity)
    {
        _db.Knowledges.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Knowledge entity)
    {
        _db.Knowledges.Remove(entity);
        await _db.SaveChangesAsync();
    }
}
