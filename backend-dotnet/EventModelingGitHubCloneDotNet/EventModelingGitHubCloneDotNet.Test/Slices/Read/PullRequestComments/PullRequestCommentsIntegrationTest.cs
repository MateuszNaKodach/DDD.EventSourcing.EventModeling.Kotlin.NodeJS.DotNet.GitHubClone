using System;
using System.Net.Http;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventModelingGitHubCloneDotNet.Shared.Infrastructure;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Domain;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Presentation;
using EventModelingGitHubCloneDotNet.Test.TestSupport;
using EventStore.Client;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Newtonsoft.Json;
using Xunit;
using Xunit.Abstractions;

namespace EventModelingGitHubCloneDotNet.Test.Slices.Read.PullRequestComments
{
    public class PullRequestCommentsIntegrationTest
    {
        private readonly HttpClient _client;
        private readonly EventStoreClient _eventStore;
        private readonly IEventSerializer _eventSerializer;
        private readonly IGuidGenerator _guidGenerator;
        private readonly ITestOutputHelper _output;

        public PullRequestCommentsIntegrationTest(ITestOutputHelper output)
        {
            _output = output;
            _eventStore = new EventStoreClient(EventStoreClientSettings.Create("esdb://localhost:2113?tls=false"));
            _eventSerializer = new PullRequestCommentsEventSerializer();
            _guidGenerator = new GuidGenerator();
            var server = new TestServer(new WebHostBuilder().UseStartup<Startup>());
            _client = server.CreateClient();
        }

        [Fact]
        public async Task UpdatePullRequestCommentsReadModelWhenSingleCommentWasAdded()
        {
            //When
            var randomOwner = _guidGenerator.GenerateString();
            var randomRepository = _guidGenerator.GenerateString();
            var repositoryId = new RepositoryId(randomOwner, randomRepository);
            var pullRequestId = _guidGenerator.GenerateString();
            var commentId = _guidGenerator.GenerateString();
            var singleCommentWasAdded = new SingleCommentWasAdded
            {
                OccurredAt = DateTime.UtcNow,
                PullRequestId = pullRequestId,
                RepositoryId = repositoryId.ToString(),
                CommentId = commentId,
                Author = "LoggedUser",
                Text = "Comment text"
            };

            var streamName = $"PullRequestComment-{commentId}";
            await _eventStore.Publish(streamName, singleCommentWasAdded, _eventSerializer);

            //Then
            var getUrl = $"/rest-api/{randomOwner}/{randomRepository}/pulls/{pullRequestId}/comments";
            await AssertionHelper.WaitUntil(async () => (await GetPullRequestComments(getUrl)).Comments.Count > 0);
            var responseBody = await GetPullRequestComments(getUrl);
            responseBody.Comments.Should().HaveCount(1);
            responseBody.Comments.Should().HaveElementAt(
                0,
                new PullRequestComment
                {
                    Author = "LoggedUser",
                    CommentId = commentId,
                    PostedAt = singleCommentWasAdded.OccurredAt,
                    PullRequestId = pullRequestId,
                    Text = "Comment text"
                }
            );
        }

        private async Task<GetPullRequestCommentsResponseBody> GetPullRequestComments(string requestUrl)
        {
            var response = await _client.GetAsync(requestUrl);
            var responseBody = JsonConvert.DeserializeObject<GetPullRequestCommentsResponseBody>(
                await response.Content.ReadAsStringAsync());
            return responseBody;
        }
    }
}