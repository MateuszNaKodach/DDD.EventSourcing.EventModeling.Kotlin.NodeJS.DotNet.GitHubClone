using System;
using System.Collections.Generic;
using EventModelingGitHubCloneDotNet.Shared.Application;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Event
{
    public class RequiredApprovesBranchProtectionRulesSerializer : JsonEventSerializer
    {
        public RequiredApprovesBranchProtectionRulesSerializer() : base(
            new Dictionary<string, Type>
            {
                ["PullRequestWasApproved"] = typeof(PullRequestWasApproved),
                ["RequiredPullRequestReviewsWereConfigured"] = typeof(RequiredPullRequestReviewsWereConfigured),
                ["PullRequestWasOpened"] = typeof(PullRequestWasOpened)
            }
        )
        {
        }
    }
}