package pl.zycienakodach.eventmodeling.githubclone.shared.domain

import java.time.Instant
import java.util.*

interface DomainEvent {
    val eventId: UUID
    val occurredAt: Instant
    val type: String
}
