namespace ContentKnowledgeService.Domain.Entities;

public class Content
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
