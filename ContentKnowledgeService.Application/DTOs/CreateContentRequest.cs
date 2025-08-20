namespace ContentKnowledgeService.Application.DTOs;

public class CreateContentRequest
{
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public Guid? CategoryId { get; set; }    // optional
}
