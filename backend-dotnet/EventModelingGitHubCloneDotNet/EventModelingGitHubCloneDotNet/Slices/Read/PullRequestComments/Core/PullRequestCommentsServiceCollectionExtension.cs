using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Infrastructure;
using EventStore.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core
{
    public static class PullRequestCommentsServiceCollectionExtension
    {
        public static IServiceCollection AddPullRequestCommentsSlice(
            this IServiceCollection services,
            EventStoreClient eventStore,
            IPullRequestCommentsRepository? repository = null
        )
        {
            IEventSerializer eventSerializer = new PullRequestCommentsEventSerializer();
            IPullRequestCommentsRepository pullRequestComments =
                repository ?? new InMemoryPullRequestCommentsRepository();
            return services
                .AddSingleton<IPullRequestCommentsRepository>(pullRequestComments)
                .AddHostedService<PullRequestCommentsProjector>(serviceProvider => new PullRequestCommentsProjector(
                    eventStore,
                    eventSerializer,
                    pullRequestComments,
                    serviceProvider.GetService<ILogger<PullRequestCommentsProjector>>()!
                ));
        }
    }
}