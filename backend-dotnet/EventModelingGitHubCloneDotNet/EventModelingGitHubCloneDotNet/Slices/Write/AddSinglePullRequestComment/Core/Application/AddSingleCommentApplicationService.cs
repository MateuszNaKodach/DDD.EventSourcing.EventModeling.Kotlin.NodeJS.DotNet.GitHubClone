using EventModelingGitHubCloneDotNet.Shared.Application;
using EventStore.Client;

namespace EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Application
{
    public class AddSingleCommentApplicationService : EventStoreApplicationService
    {
        public AddSingleCommentApplicationService(EventStoreClient eventStore, IEventSerializer eventSerializer) : base(eventStore, eventSerializer)
        {
        }
    }
}