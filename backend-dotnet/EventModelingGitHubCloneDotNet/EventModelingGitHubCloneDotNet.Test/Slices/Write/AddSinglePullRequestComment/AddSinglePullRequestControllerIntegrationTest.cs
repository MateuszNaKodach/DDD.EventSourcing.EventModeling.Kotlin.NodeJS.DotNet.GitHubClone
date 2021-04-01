using System.Net.Http;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventModelingGitHubCloneDotNet.Shared.Infrastructure;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Application;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Core.Domain;
using EventModelingGitHubCloneDotNet.Slices.Write.AddSinglePullRequestComment.Presentation;
using EventModelingGitHubCloneDotNet.Test.TestSupport;
using EventStore.Client;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Xunit;

namespace EventModelingGitHubCloneDotNet.Test.Slices.Write.AddSinglePullRequestComment
{
    public class AddSinglePullRequestControllerIntegrationTest
    {
        private readonly HttpClient _client;
        private readonly EventStoreClient _eventStore;
        private readonly IEventSerializer _eventSerializer;
        private readonly IClock _clock;
        private readonly IGuidGenerator _guidGenerator;

        public AddSinglePullRequestControllerIntegrationTest()
        {
            _eventStore = new EventStoreClient(EventStoreClientSettings.Create("esdb://localhost:2113?tls=false"));
            _eventSerializer = new AddSinglePullRequestCommentEventSerializer();
            _guidGenerator = new GuidGenerator();
            var server = new TestServer(new WebHostBuilder().UseStartup<Startup>());
            _client = server.CreateClient();
            _clock = server.Services.GetService<IClock>();
        }

        [Fact]
        public async Task PostCommentShouldResultsWithSingleCommentWasAdded()
        {
            //Given
            var randomOwner = _guidGenerator.GenerateString();
            var randomRepository = _guidGenerator.GenerateString();
            var repositoryId = new RepositoryId(randomOwner, randomRepository);
            var pullRequestId = _guidGenerator.GenerateString();

            //When
            var postRequest = new
            {
                Url = $"/rest-api/{randomOwner}/{randomRepository}/pulls/{pullRequestId}/comments",
                Body = new
                {
                    Text = "Comment text",
                    Author = "LoggedUser"
                }
            };
            var response = await _client.PostAsync(postRequest.Url, postRequest.Body.ToJson());

            //Then
            var responseBody =
                JsonConvert.DeserializeObject<PostCommentResponseBody>(await response.Content.ReadAsStringAsync());
            var expectedStreamName = $"PullRequestComment-{responseBody.CommentId}";
            var streamLastEvent = await _eventStore.StreamLastEvent(expectedStreamName, _eventSerializer);
            streamLastEvent.Should().BeEquivalentTo(
                new SingleCommentWasAdded
                (
                    pullRequestId: pullRequestId,
                    repositoryId: repositoryId.ToString(),
                    commentId: responseBody.CommentId,
                    author: "LoggedUser",
                    text: "Comment text",
                    occurredAt: _clock.Now
                )
            );
        }
    }
}