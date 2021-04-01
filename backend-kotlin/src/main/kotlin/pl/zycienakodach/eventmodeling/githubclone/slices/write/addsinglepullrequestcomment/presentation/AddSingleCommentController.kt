package pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.presentation

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.web.bind.annotation.*
import pl.zycienakodach.eventmodeling.githubclone.shared.application.ApplicationService
import pl.zycienakodach.eventmodeling.githubclone.shared.application.UUIDGenerator
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.AddSingleComment
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.CommentDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.addSingleComment
import java.time.Clock

@ConditionalOnProperty(value = ["event-modeling.github-clone.slices.write.add-single-pull-request-comment.enabled"], havingValue = "true")
@RequestMapping("/rest-api")
@RestController
class AddSingleCommentController(
    private val applicationService: ApplicationService<CommentDomainEvent>,
    private val uuidGenerator: UUIDGenerator,
    private val clock: Clock
) {

    @PostMapping("/{owner}/{repository}/pulls/{pullRequestId}/comments")
    fun postComment(
        @PathVariable owner: String,
        @PathVariable repository: String,
        @PathVariable pullRequestId: String,
        @RequestBody requestBody: PostAddSingleCommentRequestBody
    ): String {
        val repositoryId = RepositoryId(owner, repository)
        val commentId = uuidGenerator.generate().toString()
        val command = AddSingleComment(
            commentId = commentId,
            commandId = uuidGenerator.generate(),
            issuedAt = clock.instant(),
            repositoryId = repositoryId.toString(),
            pullRequestId = pullRequestId,
            text = requestBody.text,
            author = requestBody.text
        )
        applicationService.execute("PullRequestComment-$commentId")
        { history -> addSingleComment(history, command) }.join()

        return "Pull request comment was added!"
    }

}
