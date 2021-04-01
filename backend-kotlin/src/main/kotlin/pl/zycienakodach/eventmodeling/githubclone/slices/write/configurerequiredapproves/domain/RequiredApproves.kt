package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain

/**
 * Functional Event Sourcing:
 * http://blog.leifbattermann.de/2017/04/21/12-things-you-should-know-about-event-sourcing/
 */

fun configureRequiredApproves(
    history: List<PullRequestReviewingDomainEvent>,
    command: ConfigureRequiredPullRequestReviews
): List<PullRequestReviewingDomainEvent> {
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
