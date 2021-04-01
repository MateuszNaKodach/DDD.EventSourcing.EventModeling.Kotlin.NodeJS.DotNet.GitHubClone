using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.State
{
    public interface IPullRequestReviewsRepository
    {
        Task Save(PullRequestReviewApproves state);
        Task<PullRequestReviewApproves?> FindByRepositoryAndPullRequest(string repositoryId, string pullRequestId);

        Task<IEnumerable<PullRequestReviewApproves>> FindAllByRepositoryAndTargetBranch(string repositoryId,
            string targetBranch);
    }

    class InMemoryPullRequestReviewsRepository : IPullRequestReviewsRepository
    {
        private readonly ConcurrentDictionary<string, PullRequestReviewApproves> _entities = new();

        public Task Save(PullRequestReviewApproves state)
        {
            _entities[$"{state.RepositoryId}+{state.PullRequestId}"] = state;
            return Task.CompletedTask;
        }

        public Task<PullRequestReviewApproves?> FindByRepositoryAndPullRequest(string repositoryId,
            string pullRequestId)
        {
            var stateId = $"{repositoryId}+{pullRequestId}";
            if (!_entities.ContainsKey(stateId))
            {
                return Task.FromResult<PullRequestReviewApproves?>(null);
            }

            return Task.FromResult<PullRequestReviewApproves?>(_entities[stateId]);
        }

        public Task<IEnumerable<PullRequestReviewApproves>> FindAllByRepositoryAndTargetBranch(string repositoryId,
            string targetBranch)
        {
            var result = _entities.Values
                .Where(reviews => reviews.RepositoryId == repositoryId && reviews.TargetBranch == targetBranch);
            return Task.FromResult(result);
        }
    }
}