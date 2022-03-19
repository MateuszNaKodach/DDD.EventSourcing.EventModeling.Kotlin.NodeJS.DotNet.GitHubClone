package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain

import pl.zycienakodach.eventmodeling.githubclone.shared.domain.DomainEvent
import java.time.Instant
import java.util.*


sealed class PullRequestReviewingDomainEvent : DomainEvent

data class RequiredPullRequestReviewsWereConfigured(
    override val eventId: UUID,
    override val occurredAt: Instant,
    val repositoryId: String,
    val branch: String,
    val requiredApprovingReviews: Int
) : PullRequestReviewingDomainEvent() {
    override val type: String = "RequiredPullRequestReviewsWereConfigured"
}
