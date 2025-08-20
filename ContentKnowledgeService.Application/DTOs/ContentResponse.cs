namespace ContentKnowledgeService.Application.DTOs;

public class ContentResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public string CategoryName { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}
