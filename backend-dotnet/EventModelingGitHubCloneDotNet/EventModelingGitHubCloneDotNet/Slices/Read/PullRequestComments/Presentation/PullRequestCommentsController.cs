using System;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application;
using Microsoft.AspNetCore.Mvc;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Presentation
{
    [ApiController]
    [Route("/rest-api")]
    public class PullRequestCommentsController : ControllerBase
    {
        private readonly IPullRequestCommentsRepository _repository;

        public PullRequestCommentsController(IPullRequestCommentsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{owner}/{repository}/pulls/{pullRequestId}/comments")]
        public async Task<ActionResult<GetPullRequestCommentsResponseBody>> GetComments(string owner, string repository, string pullRequestId)
        {
            var comments = await _repository.FindAllBy(pullRequestId);
            return Ok(new GetPullRequestCommentsResponseBody {Comments = comments});
        }
    }
}