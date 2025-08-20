namespace ContentKnowledgeService.Application.DTOs;

public class UpdateContentRequest
{
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public Guid? CategoryId { get; set; }
}
