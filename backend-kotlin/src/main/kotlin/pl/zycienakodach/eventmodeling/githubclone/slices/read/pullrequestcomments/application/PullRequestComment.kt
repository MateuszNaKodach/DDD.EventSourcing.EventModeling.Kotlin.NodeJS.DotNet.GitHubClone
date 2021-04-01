package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application

import java.time.Instant

data class PullRequestComment(
    val pullRequestId: String,
    val commentId: String,
    val postedAt: Instant,
    val author: String,
    val text: String
)
