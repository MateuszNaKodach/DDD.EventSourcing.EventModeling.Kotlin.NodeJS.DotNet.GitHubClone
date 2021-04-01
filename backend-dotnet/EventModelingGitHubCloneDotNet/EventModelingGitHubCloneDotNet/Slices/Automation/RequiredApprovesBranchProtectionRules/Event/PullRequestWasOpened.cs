using System;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Event
{
    public class PullRequestWasOpened : IDomainEvent
    {
        public DateTime OccurredAt { get; init; }
        public string RepositoryId { get; }
        public string PullRequestId { get; }
        public string TargetBranch { get; }
        
        public PullRequestWasOpened(DateTime occurredAt, string repositoryId, string pullRequestId, string targetBranch)
        {
            OccurredAt = occurredAt;
            RepositoryId = repositoryId;
            PullRequestId = pullRequestId;
            TargetBranch = targetBranch;
        }
    }
}