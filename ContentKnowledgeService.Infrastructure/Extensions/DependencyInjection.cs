using ContentKnowledgeService.Domain.Interfaces;
using ContentKnowledgeService.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace ContentKnowledgeService.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IContentRepository, ContentRepository>();
        services.AddScoped<IKnowledgeRepository, KnowledgeRepository>();
        return services;
    }
}
