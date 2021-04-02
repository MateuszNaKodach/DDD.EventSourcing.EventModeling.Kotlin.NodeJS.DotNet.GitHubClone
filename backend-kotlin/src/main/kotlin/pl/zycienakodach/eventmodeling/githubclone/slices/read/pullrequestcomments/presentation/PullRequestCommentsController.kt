package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.presentation

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application.PullRequestCommentsRepository

@ConditionalOnProperty(value = ["event-modeling.github-clone.slices.read.pull-request-comments.enabled"], havingValue = "true")
@RequestMapping("/rest-api")
@RestController
class PullRequestCommentsController(private val repository: PullRequestCommentsRepository) {

    @GetMapping("/{owner}/{repository}/pulls/{pullRequestId}/comments")
    fun getPullRequestComments(
        @PathVariable owner: String,
        @PathVariable repository: String,
        @PathVariable pullRequestId: String,
    ) = GetPullRequestCommentsResponseBody(this.repository.findAllBy(pullRequestId))

}
