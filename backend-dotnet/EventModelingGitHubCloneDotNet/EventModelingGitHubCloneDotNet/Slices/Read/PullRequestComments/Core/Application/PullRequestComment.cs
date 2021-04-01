using System;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application
{
    public class PullRequestComment
    {
        public string PullRequestId { get; set; }
        public string CommentId { get; set; }
        public DateTime PostedAt { get; set; }
        public string Author { get; set; }
        public string Text { get; set; }

        protected bool Equals(PullRequestComment other)
        {
            return PullRequestId == other.PullRequestId && CommentId == other.CommentId &&
                   PostedAt.Equals(other.PostedAt) && Author == other.Author && Text == other.Text;
        }

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((PullRequestComment) obj);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(PullRequestId, CommentId, PostedAt, Author, Text);
        }
    }
}