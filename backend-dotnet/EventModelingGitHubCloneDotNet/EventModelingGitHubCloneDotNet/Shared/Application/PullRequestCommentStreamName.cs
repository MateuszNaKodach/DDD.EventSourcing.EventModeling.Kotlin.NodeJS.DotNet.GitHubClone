namespace EventModelingGitHubCloneDotNet.Shared.Application
{
    public class PullRequestCommentStreamName
    {
        public static string CATEGORY = "PullRequestComment";
        
        private readonly string _commentId;

        public PullRequestCommentStreamName(string commentId)
        {
            this._commentId = commentId;
        }

        public override string ToString() => $"{CATEGORY}-{_commentId}";
    }
}