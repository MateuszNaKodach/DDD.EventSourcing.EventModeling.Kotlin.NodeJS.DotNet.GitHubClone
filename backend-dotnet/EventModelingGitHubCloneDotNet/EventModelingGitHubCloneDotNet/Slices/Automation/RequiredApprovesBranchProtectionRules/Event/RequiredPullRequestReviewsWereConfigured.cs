using System;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Event
{
    public class RequiredPullRequestReviewsWereConfigured : IDomainEvent
    {
        public DateTime OccurredAt { get; init; }
        public string RepositoryId { get; init; }
        public string Branch { get; init; }
        public int RequiredApprovingReviews { get; init; }

        public RequiredPullRequestReviewsWereConfigured(DateTime occurredAt, string repositoryId, string branch, int requiredApprovingReviews)
        {
            OccurredAt = occurredAt;
            RepositoryId = repositoryId;
            Branch = branch;
            RequiredApprovingReviews = requiredApprovingReviews;
        }

        public override string ToString()
        {
            return $"RequiredPullRequestReviewsWereConfigured | {nameof(OccurredAt)}: {OccurredAt}, {nameof(RepositoryId)}: {RepositoryId}, {nameof(Branch)}: {Branch}, {nameof(RequiredApprovingReviews)}: {RequiredApprovingReviews}";
        }
    }
}