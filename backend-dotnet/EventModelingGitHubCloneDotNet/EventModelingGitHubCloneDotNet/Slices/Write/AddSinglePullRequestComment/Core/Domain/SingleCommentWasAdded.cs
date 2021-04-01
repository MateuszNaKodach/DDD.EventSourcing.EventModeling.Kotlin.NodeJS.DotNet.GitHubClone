using System;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Domain
{
    public class SingleCommentWasAdded : IDomainEvent
    {
        public DateTime OccurredAt { get; init; }
        public string RepositoryId { get; init; }
        public string PullRequestId { get; init; }
        public string CommentId { get; init; }
        public string Author { get; init; }
        public string Text { get; init; }

        public SingleCommentWasAdded(DateTime occurredAt, string repositoryId, string pullRequestId, string commentId, string author, string text)
        {
            OccurredAt = occurredAt;
            RepositoryId = repositoryId;
            PullRequestId = pullRequestId;
            CommentId = commentId;
            Author = author;
            Text = text;
        }

        public override string ToString()
        {
            return $"SingleCommentWasAdded | {nameof(OccurredAt)}: {OccurredAt}, {nameof(RepositoryId)}: {RepositoryId}, {nameof(PullRequestId)}: {PullRequestId}, {nameof(CommentId)}: {CommentId}, {nameof(Author)}: {Author}, {nameof(Text)}: {Text}";
        }
    }
}