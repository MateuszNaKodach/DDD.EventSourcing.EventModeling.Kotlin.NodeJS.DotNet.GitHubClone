using System.Collections.Generic;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Domain
{
    public class Comments
    {
        private readonly IClock _clock;

        public Comments(IClock clock)
        {
            _clock = clock;
        }

        public IEnumerable<IDomainEvent> AddSingleComment(IEnumerable<IDomainEvent> history, AddSingleComment command)
        {
            return new List<IDomainEvent>
            {
                new SingleCommentWasAdded
                (
                    pullRequestId: command.PullRequestId,
                    repositoryId: command.RepositoryId,
                    commentId: command.CommentId,
                    author: command.Author,
                    text: command.Text,
                    occurredAt: _clock.Now
                )
            };
        }
    }
}