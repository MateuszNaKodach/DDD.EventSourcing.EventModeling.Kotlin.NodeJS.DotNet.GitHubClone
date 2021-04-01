using System;
using System.Collections.Generic;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Domain;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application
{
    public class PullRequestCommentsEventSerializer : JsonEventSerializer
    {
        public PullRequestCommentsEventSerializer() : base(
            new Dictionary<string, Type>
            {
                ["SingleCommentWasAdded"] = typeof(SingleCommentWasAdded)
            }
        )
        {
        }
    }
}