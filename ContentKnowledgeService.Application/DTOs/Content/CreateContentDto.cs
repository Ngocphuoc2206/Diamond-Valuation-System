using System.ComponentModel.DataAnnotations;

namespace ContentKnowledgeService.Application.DTOs.Content;

public class CreateContentDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Body { get; set; } = string.Empty;
    [MaxLength(100)]
    public string Author { get; set; } = "system";
    [Required]
    public string Type { get; set; } = "Blog"; // Blog | Guide | Research
    public string Slug { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = true;
}
