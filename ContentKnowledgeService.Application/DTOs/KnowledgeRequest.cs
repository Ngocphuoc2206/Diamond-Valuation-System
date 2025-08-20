namespace ContentKnowledgeService.Application.DTOs;

public class KnowledgeRequest
{
    public string Title { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Content { get; set; } = "";
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; } // cho nhanh khi chưa có CategoryId
}
