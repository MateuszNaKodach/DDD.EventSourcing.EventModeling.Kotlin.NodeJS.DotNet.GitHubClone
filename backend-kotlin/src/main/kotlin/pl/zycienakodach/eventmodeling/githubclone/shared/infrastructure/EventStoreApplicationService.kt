package pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure

import com.eventstore.dbclient.EventStoreDBClient
import pl.zycienakodach.eventmodeling.githubclone.shared.application.ApplicationService
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent
import java.util.concurrent.CompletableFuture

class EventStoreApplicationService<EventType : DomainEvent>(
    private val eventStore: EventStoreDBClient,
    private val eventMapper: EventMapper<EventType>
) : ApplicationService<EventType> {

    override fun execute(streamName: String, command: (List<EventType>) -> List<EventType>): CompletableFuture<out Any> {
        return eventStore.readStream(streamName)
            .thenApply { result -> result.events.mapNotNull { recordedEvent -> eventMapper.toDomainEvent(recordedEvent.event) } }
            .handle { events, exception -> if (exception == null) events else emptyList() }
            .thenApply { domainEvents -> command(domainEvents) }
            .thenCompose { newEvents ->
                val eventsToStore = newEvents.map(eventMapper::toEventData)
                eventStore.appendToStream(streamName, *eventsToStore.toTypedArray())
            }
    }


}

