using System.ComponentModel.DataAnnotations;

namespace ContentKnowledgeService.Application.DTOs.Knowledge;

public class UpdateKnowledgeDto
{
    [Required]
    public Guid Id { get; set; }
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
}
