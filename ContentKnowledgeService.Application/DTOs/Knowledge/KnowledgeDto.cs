namespace ContentKnowledgeService.Application.DTOs.Knowledge;

public record KnowledgeDto(Guid Id, string Title, string Description, string Tags, DateTime CreatedAt, DateTime? UpdatedAt);
