using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventStore.Client;

namespace EventModelingGitHubCloneDotNet.Test.TestSupport
{
    public static class EventStoreTestExtensions
    {
        public static async Task<IDomainEvent> StreamLastEvent(
            this EventStoreClient eventStore,
            string streamName,
            IEventSerializer eventSerializer
        )
        {
            var expectedStream = eventStore.ReadStreamAsync(
                Direction.Forwards,
                streamName,
                StreamPosition.Start
            );
            var readState = await expectedStream.ReadState;
            var streamEvents = readState == ReadState.StreamNotFound
                ? new List<IDomainEvent>()
                : await expectedStream.Select(eventSerializer.Deserialize)
                    .Where(@event => @event != null)
                    .Select(@event => @event!)
                    .ToListAsync();
            IDomainEvent lastStreamEvent = streamEvents.Last();
            return lastStreamEvent;
        }

        public static async Task Publish(
            this EventStoreClient eventStore,
            string streamName,
            IDomainEvent domainEvent,
            IEventSerializer eventSerializer
        )
        {
            await eventStore.AppendToStreamAsync(streamName, StreamState.Any,
                new[] {eventSerializer.Serialize(domainEvent)});
        }
    }
}