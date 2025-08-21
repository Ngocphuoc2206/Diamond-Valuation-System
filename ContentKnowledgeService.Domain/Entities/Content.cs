namespace ContentKnowledgeService.Domain.Entities;

public enum ContentType
{
    Blog = 0,
    Guide = 1,
    Research = 2
}

public class Content
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string Author { get; set; } = "system";
    public ContentType Type { get; set; } = ContentType.Blog;
    public string Slug { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
