package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.infrastructure

import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application.PullRequestComment
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application.PullRequestCommentsRepository
import java.util.concurrent.ConcurrentHashMap

class InMemoryPullRequestCommentsRepository : PullRequestCommentsRepository {

    private val entries = ConcurrentHashMap<String, PullRequestComment>()

    override fun findAllBy(pullRequestId: String): List<PullRequestComment> {
        return entries.values.filter { it.pullRequestId == pullRequestId }
    }

    override fun save(comment: PullRequestComment) {
        entries[comment.commentId] = comment
    }
}
