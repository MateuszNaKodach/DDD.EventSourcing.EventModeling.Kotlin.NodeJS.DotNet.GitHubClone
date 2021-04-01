using System.Collections.Immutable;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Presentation
{
    public class GetPullRequestCommentsResponseBody
    {
        public ImmutableList<PullRequestComment> Comments { get; set; }
    }
}