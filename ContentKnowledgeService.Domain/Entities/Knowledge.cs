namespace ContentKnowledgeService.Domain.Entities;

public class Knowledge
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Content { get; set; } = "";
    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
    