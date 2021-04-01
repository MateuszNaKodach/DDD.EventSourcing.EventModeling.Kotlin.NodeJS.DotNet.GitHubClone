using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Application;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Domain;
using EventStore.Client;
using Microsoft.Extensions.DependencyInjection;

namespace EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core
{
    public static class AddSinglePullRequestCommentServiceCollectionExtension
    {
        public static IServiceCollection AddSinglePullRequestCommentSlice(
            this IServiceCollection services,
            EventStoreClient eventStore,
            IClock clock
        )
        {
            IEventSerializer eventSerializer = new AddSinglePullRequestCommentEventSerializer();
            return services
                .AddSingleton(new Comments(clock))
                .AddSingleton(new AddSingleCommentApplicationService(eventStore, eventSerializer));
        }
    }
}