package pl.zycienakodach.eventmodeling.githubclone.testsupport

import com.eventstore.dbclient.EventStoreDBClient
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventSerializer
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent

interface ReadSliceTestSupport<EventType: DomainEvent> {
    val eventStore: EventStoreDBClient
    val eventSerializer: EventSerializer<EventType>

    fun EventStoreDBClient.publish(streamName: String, event: EventType) {
        eventStore.appendToStream(streamName, eventSerializer.toEventData(event)).join()
    }
}
