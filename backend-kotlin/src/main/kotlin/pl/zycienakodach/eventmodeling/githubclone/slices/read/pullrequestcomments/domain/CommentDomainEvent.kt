package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.domain

import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent
import java.time.Instant
import java.util.*

sealed class CommentDomainEvent : DomainEvent

data class SingleCommentWasAdded(
    override val eventId: UUID,
    override val occurredAt: Instant,
    val repositoryId: String,
    val pullRequestId: String,
    val commentId: String,
    val author: String,
    val text: String
) : CommentDomainEvent() {
    override val type: String = "SingleCommentWasAdded"
}
