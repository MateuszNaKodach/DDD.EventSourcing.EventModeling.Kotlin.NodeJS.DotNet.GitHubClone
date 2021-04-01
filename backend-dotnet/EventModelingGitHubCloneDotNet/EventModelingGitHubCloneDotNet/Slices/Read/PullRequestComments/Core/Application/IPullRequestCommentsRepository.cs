using System.Collections.Immutable;
using System.Threading.Tasks;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application
{
    public interface IPullRequestCommentsRepository
    {
        Task Save(PullRequestComment comment);

        Task<int> CountBy(string pullRequestId);

        Task<ImmutableList<PullRequestComment>> FindAllBy(string pullRequestId);
    }
}