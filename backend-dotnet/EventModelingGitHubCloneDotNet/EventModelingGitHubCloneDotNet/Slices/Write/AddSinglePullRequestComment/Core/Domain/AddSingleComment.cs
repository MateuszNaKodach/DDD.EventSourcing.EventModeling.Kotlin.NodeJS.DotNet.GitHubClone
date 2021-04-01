namespace EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Domain
{
    public class AddSingleComment
    {
        public string RepositoryId { get; }
        public string PullRequestId { get; }
        public string CommentId { get; }
        public string Author { get; }
        public string Text { get; }

        public AddSingleComment(string repositoryId, string pullRequestId, string commentId, string author, string text)
        {
            RepositoryId = repositoryId;
            PullRequestId = pullRequestId;
            CommentId = commentId;
            Author = author;
            Text = text;
        }
    }
}