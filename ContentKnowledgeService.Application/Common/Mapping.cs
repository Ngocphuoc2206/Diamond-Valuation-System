using ContentKnowledgeService.Application.DTOs.Content;
using ContentKnowledgeService.Application.DTOs.Knowledge;
using ContentKnowledgeService.Domain.Entities;

namespace ContentKnowledgeService.Application.Common;

public static class Mapping
{
    public static ContentDto ToDto(this Content e) =>
        new(e.Id, e.Title, e.Body, e.Author, e.Type.ToString(), e.Slug, e.IsPublished, e.CreatedAt, e.UpdatedAt);

    public static KnowledgeDto ToDto(this Knowledge e) =>
        new(e.Id, e.Title, e.Description, e.Tags, e.CreatedAt, e.UpdatedAt);
}
