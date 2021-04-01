package pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.domain

import java.time.Instant
import java.util.*


data class ApprovePullRequest(
    val commandId: UUID,
    val reviewedAt: Instant,
    val repositoryId: String,
    val pullRequestId: String,
    val comment: String,
    val reviewer: String,
)

fun approvePullRequest(
    history: List<PullRequestReviewingDomainEvent>,
    command: ApprovePullRequest
): List<PullRequestReviewingDomainEvent> {
    return listOf(
        PullRequestWasApproved(
            eventId = command.commandId,
            occurredAt = command.reviewedAt,
            repositoryId = command.repositoryId,
            pullRequestId = command.pullRequestId,
            comment = command.comment,
            reviewer = command.reviewer
        )
    )
}
