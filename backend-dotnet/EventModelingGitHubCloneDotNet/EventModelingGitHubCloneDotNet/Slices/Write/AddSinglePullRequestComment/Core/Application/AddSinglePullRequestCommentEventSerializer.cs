using System;
using System.Collections.Generic;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Domain;

namespace EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Application
{
    public class AddSinglePullRequestCommentEventSerializer : JsonEventSerializer
    {
        public AddSinglePullRequestCommentEventSerializer() : base(
            new Dictionary<string, Type>
            {
                ["SingleCommentWasAdded"] = typeof(SingleCommentWasAdded)
            }
        )
        {
        }
    }
}