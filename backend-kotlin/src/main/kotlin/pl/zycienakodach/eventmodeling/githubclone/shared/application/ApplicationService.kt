package pl.zycienakodach.eventmodeling.githubclone.shared.application

import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent
import java.util.concurrent.CompletableFuture

interface ApplicationService<EventType : DomainEvent> {
    fun execute(streamName: String, command: (List<EventType>) -> List<EventType>): CompletableFuture<out Any>
}
