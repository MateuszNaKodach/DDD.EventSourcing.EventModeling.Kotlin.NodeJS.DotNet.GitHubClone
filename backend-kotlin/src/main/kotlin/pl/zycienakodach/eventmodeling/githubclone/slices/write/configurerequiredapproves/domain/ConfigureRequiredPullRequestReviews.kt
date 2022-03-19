package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain

import java.time.Instant
import java.util.*

data class ConfigureRequiredPullRequestReviews(
    val commandId: UUID,
    val issuedAt: Instant,
    val repositoryId: String,
    val branch: String,
    val requiredApprovingReviews: Int
)

fun configureRequiredPullRequestReviews(history: List<PullRequestReviewingDomainEvent>, command: ConfigureRequiredPullRequestReviews): List<PullRequestReviewingDomainEvent> {
    return listOf(
        RequiredPullRequestReviewsWereConfigured(
            eventId = command.commandId,
            occurredAt = command.issuedAt,
            repositoryId = command.repositoryId,
            branch = command.branch,
            requiredApprovingReviews = command.requiredApprovingReviews
        )
    )
}
