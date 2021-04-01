using System.Collections.Immutable;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.State
{
    public class PullRequestReviewApproves
    {
        public string RepositoryId { get; init; }
        public string PullRequestId { get; init; }
        public string TargetBranch { get; init; }

        private ImmutableHashSet<string> _approvedByReviewers = ImmutableHashSet.Create<string>();

        public int Approves => _approvedByReviewers.Count;
        
        public PullRequestReviewApproves WithApproveFrom(string reviewer) =>
            new()
            {
                RepositoryId = RepositoryId,
                PullRequestId = PullRequestId,
                TargetBranch = TargetBranch,
                _approvedByReviewers = _approvedByReviewers.Add(reviewer)
            };
    }
}