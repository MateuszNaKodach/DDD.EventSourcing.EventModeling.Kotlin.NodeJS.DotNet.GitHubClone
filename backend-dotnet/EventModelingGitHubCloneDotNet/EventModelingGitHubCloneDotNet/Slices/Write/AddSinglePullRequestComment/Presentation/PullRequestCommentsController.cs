using System;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Application;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Domain;
using Microsoft.AspNetCore.Mvc;

namespace EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Presentation
{
    [ApiController]
    [Route("/rest-api")]
    public class PullRequestCommentsController : ControllerBase
    {
        private readonly AddSingleCommentApplicationService _applicationService;
        private readonly Comments _comments;
        private readonly IGuidGenerator _guidGenerator;

        public PullRequestCommentsController(AddSingleCommentApplicationService applicationService, Comments comments,
            IGuidGenerator guidGenerator)
        {
            _applicationService = applicationService;
            _comments = comments;
            _guidGenerator = guidGenerator;
        }

        [HttpPost("{owner}/{repository}/pulls/{pullRequestId}/comments")]
        public async Task<ActionResult<PostCommentResponseBody>> PostComment(
            string owner,
            string repository,
            string pullRequestId,
            [FromBody] PostCommentRequestBody requestBody)
        {
            var commentId = _guidGenerator.GenerateString();
            var repositoryId = new RepositoryId(owner, repository);
            var command = new AddSingleComment
            (
                pullRequestId: pullRequestId,
                repositoryId: repositoryId.ToString(),
                commentId: commentId,
                author: requestBody.Author,
                text: requestBody.Text
            );

            var streamName = new PullRequestCommentStreamName(commentId).ToString();
            await _applicationService.ExecuteAsync(streamName, history => _comments.AddSingleComment(history, command));
            return Created(
                $"repositories/{repositoryId}/pulls/{pullRequestId}/comments",
                new PostCommentResponseBody {CommentId = commentId}
            );
        }
    }
}