package pl.zycienakodach.eventmodeling.githubclone.testsupport

import com.eventstore.dbclient.EventStoreDBClient
import com.eventstore.dbclient.ReadStreamOptions
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventDeserializer
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent

interface WriteSliceTestSupport {
    val eventStore: EventStoreDBClient
    val eventDeserializer: EventDeserializer<DomainEvent>

    fun EventStoreDBClient.eventsInStream(streamName: String): Int {
        val streamOfEvents = eventStore.readStream(streamName).join().events
        return streamOfEvents.size
    }

    fun EventStoreDBClient.streamLastEvent(streamName: String): DomainEvent? {
        val streamOfEvents = eventStore.readStream(streamName, 1, ReadStreamOptions.get().backwards().fromEnd()).join().events
        return streamOfEvents[0].originalEvent?.let { eventDeserializer.toDomainEvent(it) }
    }
}
