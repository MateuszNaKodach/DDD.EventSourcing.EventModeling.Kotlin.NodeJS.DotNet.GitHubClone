using System;
using System.Threading;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Domain;
using EventStore.Client;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EventModelingGitHubCloneDotNet.Slices.Read.PullRequestComments.Core.Application
{
    public class PullRequestCommentsProjector : BackgroundService
    {
        private readonly EventStoreClient _eventStore;
        private readonly IEventSerializer _eventSerializer;
        private readonly IPullRequestCommentsRepository _repository;
        private readonly ILogger<PullRequestCommentsProjector> _logger;

        public PullRequestCommentsProjector(
            EventStoreClient eventStore,
            IEventSerializer eventSerializer,
            IPullRequestCommentsRepository repository,
            ILogger<PullRequestCommentsProjector> logger
        )
        {
            _eventStore = eventStore;
            _repository = repository;
            _logger = logger;
            _eventSerializer = eventSerializer;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation($"PullRequestCommentsProjector started!");
            stoppingToken.Register(() =>
                _logger.LogInformation("PullRequestCommentsProjector is stopping!"));
            return _eventStore.SubscribeToStreamAsync(
                $"$ce-{PullRequestCommentStreamName.CATEGORY}",
                HandleEvent,
                subscriptionDropped: SubscriptionDropped,
                resolveLinkTos: true,
                cancellationToken: stoppingToken
            );
        }

        private async Task HandleEvent(StreamSubscription subscription, ResolvedEvent resolvedEvent,
            CancellationToken cancellationToken)
        {
            var domainEvent = _eventSerializer.Deserialize(resolvedEvent);
            if (domainEvent == null)
            {
                return;
            }

            _logger.LogInformation($"PullRequestCommentsProjector handled event: {domainEvent}");
            switch (domainEvent)
            {
                case SingleCommentWasAdded added:
                    var comment = new PullRequestComment
                    {
                        PullRequestId = added.PullRequestId,
                        CommentId = added.CommentId,
                        PostedAt = added.OccurredAt,
                        Author = added.Author,
                        Text = added.Text
                    };
                    await _repository.Save(comment);
                    break;
            }
        }

        private void SubscriptionDropped(StreamSubscription subscription, SubscriptionDroppedReason reason,
            Exception? exception)
        {
            if (exception != null)
            {
                _logger.LogError($"PullRequestCommentsProjector dropped due to: {reason}", exception);
            }
            else
            {
                _logger.LogInformation($"PullRequestCommentsProjector dropped due to: {reason}");
            }
        }
    }
}