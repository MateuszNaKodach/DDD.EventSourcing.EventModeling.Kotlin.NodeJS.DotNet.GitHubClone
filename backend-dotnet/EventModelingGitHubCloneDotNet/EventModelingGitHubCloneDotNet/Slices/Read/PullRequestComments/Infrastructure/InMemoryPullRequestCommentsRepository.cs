using System.Collections.Concurrent;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Infrastructure
{
    class InMemoryPullRequestCommentsRepository : IPullRequestCommentsRepository
    {
        private readonly ConcurrentDictionary<string, PullRequestComment> _entities =
            new ConcurrentDictionary<string, PullRequestComment>();

        public Task Save(PullRequestComment comment)
        {
            _entities[comment.CommentId] = comment;
            return Task.CompletedTask;
        }

        public Task<int> CountBy(string pullRequestId)
        {
            return Task.FromResult(_entities.Count);
        }

        public Task<ImmutableList<PullRequestComment>> FindAllBy(string pullRequestId)
        {
            var result = _entities.Values.Where(comment => comment.PullRequestId.Equals(pullRequestId)).ToImmutableList();
            return Task.FromResult(result);
        }
    }
}