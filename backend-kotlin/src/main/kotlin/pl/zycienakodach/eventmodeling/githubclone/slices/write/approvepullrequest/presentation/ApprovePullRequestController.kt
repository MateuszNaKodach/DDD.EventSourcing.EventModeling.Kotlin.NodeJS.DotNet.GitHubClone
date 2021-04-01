package pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.presentation

import org.springframework.web.bind.annotation.*
import pl.zycienakodach.eventmodeling.githubclone.shared.application.UUIDGenerator
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.EventStoreApplicationService
import pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.domain.ApprovePullRequest
import pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.domain.approvePullRequest
import java.time.Clock

@RequestMapping("/rest-api")
@RestController
class ApprovePullRequestController(
    private val applicationService: EventStoreApplicationService<PullRequestReviewingDomainEvent>,
    private val uuidGenerator: UUIDGenerator,
    private val clock: Clock
) {

    @PostMapping("/{owner}/{repository}/{pullRequestId}/reviews/approves")
    fun postApprovePullRequest(
        @PathVariable owner: String,
        @PathVariable repository: String,
        @PathVariable pullRequestId: String,
        @RequestBody requestBody: PostApprovePullRequestBody
    ): String {
        val repositoryId = RepositoryId(owner, repository)
        val command = ApprovePullRequest(
            commandId = uuidGenerator.generate(),
            reviewedAt = clock.instant(),
            repositoryId = repositoryId.toString(),
            pullRequestId = pullRequestId,
            comment = requestBody.comment,
            reviewer = requestBody.reviewer
        )
        applicationService.execute("PullRequestReviewing-$repositoryId")
        { history -> approvePullRequest(history, command) }.join()

        return "Pull request was approved!"
    }

}
