package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain

import java.time.Instant
import java.util.*

data class ConfigureRequiredPullRequestReviews(
    val commandId: UUID,
    val issuedAt: Instant,
    val repositoryId: String,
    val branch: String,
    val requiredApprovingReviews: Int,
)
