package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application

interface PullRequestCommentsRepository {
    fun findAllBy(pullRequestId: String): List<PullRequestComment>
    fun save(comment: PullRequestComment)
}
