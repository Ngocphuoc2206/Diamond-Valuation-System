namespace ContentKnowledgeService.Domain.Entities;

public class Knowledge
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    /// <summary>
    /// Comma-separated tags (e.g., "4C,cut,color,clarity")
    /// </summary>
    public string Tags { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
