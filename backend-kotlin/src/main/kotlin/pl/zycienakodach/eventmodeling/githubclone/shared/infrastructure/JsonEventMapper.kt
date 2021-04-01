package pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure

import com.eventstore.dbclient.EventData
import com.eventstore.dbclient.RecordedEvent
import com.fasterxml.jackson.databind.ObjectMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent
import kotlin.reflect.KClass

class JsonEventMapper<EventType : DomainEvent>(
    private val objectMapper: ObjectMapper,
    private val eventTypes: Map<String, KClass<out EventType>>
) : EventMapper<EventType> {

    override fun toDomainEvent(recordedEvent: RecordedEvent): EventType? {
        val eventClass = eventTypes[recordedEvent.eventType] ?: return null
        return objectMapper.readValue(recordedEvent.eventData, eventClass.java)
    }

    override fun toEventData(domainEvent: EventType): EventData {
        return EventData(
            domainEvent.eventId,
            domainEvent.type,
            "application/json",
            objectMapper.writeValueAsBytes(domainEvent),
            objectMapper.writeValueAsBytes(objectMapper.createObjectNode())
        )
    }

}
