using System;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Event
{
    public class PullRequestWasApproved : IDomainEvent
    {
        public DateTime OccurredAt { get; init; }
        public string RepositoryId { get; init; }
        public string PullRequestId { get; init; }
        public string Comment { get; init; }
        public string Reviewer { get; init; }

        public PullRequestWasApproved(DateTime occurredAt, string repositoryId, string pullRequestId, string comment, string reviewer)
        {
            OccurredAt = occurredAt;
            RepositoryId = repositoryId;
            PullRequestId = pullRequestId;
            Comment = comment;
            Reviewer = reviewer;
        }

        public override string ToString()
        {
            return $"PullRequestWasApproved | {nameof(OccurredAt)}: {OccurredAt}, {nameof(RepositoryId)}: {RepositoryId}, {nameof(PullRequestId)}: {PullRequestId}, {nameof(Comment)}: {Comment}, {nameof(Reviewer)}: {Reviewer}";
        }
    }
}