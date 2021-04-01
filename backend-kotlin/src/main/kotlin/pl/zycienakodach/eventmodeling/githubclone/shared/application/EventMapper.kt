package pl.zycienakodach.eventmodeling.githubclone.shared.application

import com.eventstore.dbclient.EventData
import com.eventstore.dbclient.RecordedEvent
import com.eventstore.dbclient.ResolvedEvent
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent

interface EventMapper<EventType : DomainEvent> : EventDeserializer<EventType>, EventSerializer<EventType>

interface EventDeserializer<out EventType : DomainEvent> {
    fun toDomainEvent(recordedEvent: RecordedEvent): EventType?
}

interface EventSerializer<in EventType : DomainEvent> {
    fun toEventData(domainEvent: EventType): EventData
}
