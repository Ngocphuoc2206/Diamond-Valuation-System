namespace ContentKnowledgeService.Application.DTOs.Content;

public record ContentDto(Guid Id, string Title, string Body, string Author, string Type, string Slug, bool IsPublished, DateTime CreatedAt, DateTime? UpdatedAt);
