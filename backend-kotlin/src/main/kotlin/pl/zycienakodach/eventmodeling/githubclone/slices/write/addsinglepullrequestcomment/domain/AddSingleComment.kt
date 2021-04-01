package pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain

import java.time.Instant
import java.util.*

data class AddSingleComment(
    val commandId: UUID,
    val issuedAt: Instant,
    val repositoryId: String,
    val pullRequestId: String,
    val commentId: String,
    val author: String,
    val text: String
)

fun addSingleComment(
    history: List<CommentDomainEvent>,
    command: AddSingleComment
): List<CommentDomainEvent> {
    if (history.isNotEmpty()) {
        throw IllegalStateException("Comment already exists!")
    }
    return listOf(
        SingleCommentWasAdded(
            eventId = command.commandId,
            occurredAt = command.issuedAt,
            repositoryId = command.repositoryId,
            pullRequestId = command.pullRequestId,
            commentId = command.commentId,
            text = command.text,
            author = command.author
        )
    )
}
