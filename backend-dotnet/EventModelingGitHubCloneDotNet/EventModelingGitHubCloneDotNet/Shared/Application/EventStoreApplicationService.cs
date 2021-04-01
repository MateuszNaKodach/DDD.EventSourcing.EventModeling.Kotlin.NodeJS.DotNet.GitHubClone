using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventStore.Client;

namespace EventModelingGitHubCloneDotNet.Shared.Application
{
    public class EventStoreApplicationService : IApplicationService
    {
        private readonly EventStoreClient _eventStore;
        private readonly IEventSerializer _eventSerializer;

        public EventStoreApplicationService(EventStoreClient eventStore, IEventSerializer eventSerializer)
        {
            _eventStore = eventStore;
            _eventSerializer = eventSerializer;
        }

        public async Task ExecuteAsync(string streamName, DomainCommand domainCommand,
            CancellationToken cancellationToken = default)
        {
            //Reading stream 
            var eventStream = _eventStore.ReadStreamAsync(
                Direction.Forwards,
                streamName,
                StreamPosition.Start,
                cancellationToken: cancellationToken);

            //Checking if stream exists
            var streamNotFound = await eventStream.ReadState == ReadState.StreamNotFound;

            //Stream version for optimistic concurrency. We use it during appending.
            StreamRevision streamVersion = streamNotFound
                ? StreamRevision.None.ToUInt64()
                : (await eventStream.LastAsync(cancellationToken: cancellationToken)).Event.EventNumber.ToUInt64();

            //If stream not found our history is empty, if found - read events from event store as history
            var history = streamNotFound
                ? new List<IDomainEvent>()
                : await eventStream.Select(resolvedEvent => _eventSerializer.Deserialize(resolvedEvent))
                    .Where(@event => @event != null)
                    .Select(@event => @event!)
                    .ToListAsync(cancellationToken);

            //Execute domain operation, which takes history of events and produce new events (changes)
            var changes = domainCommand(history);
            
            //Serialize events to event store format
            var eventsToStore = changes.Select(change => _eventSerializer.Serialize(change));
            
            //Append new changes (events) to the stream
            await _eventStore.AppendToStreamAsync(streamName, streamVersion, eventsToStore.ToList(),
                cancellationToken: cancellationToken);
        }
    }
}