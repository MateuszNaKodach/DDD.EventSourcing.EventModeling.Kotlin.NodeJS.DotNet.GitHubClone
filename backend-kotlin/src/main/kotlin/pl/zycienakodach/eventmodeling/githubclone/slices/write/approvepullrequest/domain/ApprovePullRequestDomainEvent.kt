package pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.domain

import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent
import java.time.Instant
import java.util.*

sealed class PullRequestReviewingDomainEvent : DomainEvent

data class PullRequestWasApproved(
    override val eventId: UUID,
    override val occurredAt: Instant,
    val repositoryId: String,
    val pullRequestId: String,
    val comment: String,
    val reviewer: String
) : PullRequestReviewingDomainEvent() {
    override val type: String = "PullRequestWasApproved"
}
