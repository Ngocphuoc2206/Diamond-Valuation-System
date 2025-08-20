namespace ContentKnowledgeService.Application.DTOs;

public class KnowledgeResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Content { get; set; } = "";
    public string CategoryName { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}
