package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.presentation

import org.springframework.web.bind.annotation.*
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.ConfigureRequiredPullRequestReviews
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.configureRequiredApproves
import pl.zycienakodach.eventmodeling.githubclone.shared.application.UUIDGenerator
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.EventStoreApplicationService
import java.time.Clock

@RequestMapping("/rest-api")
@RestController
class PullRequestRequiredApprovesController(
    private val applicationService: EventStoreApplicationService<PullRequestReviewingDomainEvent>,
    private val uuidGenerator: UUIDGenerator,
    private val clock: Clock
) {

    @PostMapping("/{owner}/{repository}/settings/branch-protection-rules/required-approves")
    fun postConfigureRequiredApproves(
        @PathVariable owner: String,
        @PathVariable repository: String,
        @RequestBody requestBody: ConfigureRequiredApprovesRequestBody
    ): String {
        val repositoryId = RepositoryId(owner, repository)
        val command = ConfigureRequiredPullRequestReviews(
            commandId = uuidGenerator.generate(),
            issuedAt = clock.instant(),
            repositoryId = repositoryId.toString(),
            branch = requestBody.branch,
            requiredApprovingReviews = requestBody.requiredApprovingReviews
        )
        applicationService.execute("PullRequestReviewing-$repositoryId") { history -> configureRequiredApproves(history, command) }.join()

        return repositoryId.toString();
    }
}
