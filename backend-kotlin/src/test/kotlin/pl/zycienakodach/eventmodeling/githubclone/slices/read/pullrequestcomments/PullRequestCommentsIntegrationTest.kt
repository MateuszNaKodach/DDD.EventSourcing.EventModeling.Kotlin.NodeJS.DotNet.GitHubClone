package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments

import assertk.assertThat
import assertk.assertions.containsExactlyInAnyOrder
import com.eventstore.dbclient.EventStoreDBClient
import org.awaitility.Awaitility
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventSerializer
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application.PullRequestComment
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application.PullRequestCommentsRepository
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.domain.CommentDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.domain.SingleCommentWasAdded
import pl.zycienakodach.eventmodeling.githubclone.testsupport.ReadSliceTestSupport
import java.time.Instant
import java.util.*

@SpringBootTest
class PullRequestCommentsIntegrationTest
@Autowired constructor(
    val repository: PullRequestCommentsRepository,
    override val eventSerializer: EventSerializer<CommentDomainEvent>,
    override val eventStore: EventStoreDBClient,
) : ReadSliceTestSupport<CommentDomainEvent> {


    @Test
    fun `should update pull request comments read model when single comment was added`() {
        //Given
        val currentTime = Instant.now()
        val randomOwner = UUID.randomUUID().toString()
        val randomRepository = UUID.randomUUID().toString()
        val repositoryId = RepositoryId(randomOwner, randomRepository)
        val pullRequestId = UUID.randomUUID().toString()

        //When
        val singleCommentWasAdded1 = SingleCommentWasAdded(
            eventId = UUID.randomUUID(),
            occurredAt = currentTime,
            repositoryId = repositoryId.toString(),
            pullRequestId = pullRequestId,
            commentId = UUID.randomUUID().toString(),
            text = "Comment text. Lorem ipsum",
            author = "john.kovalsky"
        )
        val singleCommentWasAdded2 = SingleCommentWasAdded(
            eventId = UUID.randomUUID(),
            occurredAt = currentTime,
            repositoryId = repositoryId.toString(),
            pullRequestId = pullRequestId,
            commentId = UUID.randomUUID().toString(),
            text = "Another Comment text. Dolor sit ament",
            author = "dzoanna.novak"
        )
        eventStore.publish("PullRequestComment-${singleCommentWasAdded1.commentId}", singleCommentWasAdded1)
        eventStore.publish("PullRequestComment-${singleCommentWasAdded2.commentId}", singleCommentWasAdded2)

        //Then
        Awaitility.await().untilAsserted {
            assertThat(repository.findAllBy(pullRequestId)).containsExactlyInAnyOrder(
                PullRequestComment(
                    pullRequestId,
                    singleCommentWasAdded1.commentId,
                    singleCommentWasAdded1.occurredAt,
                    singleCommentWasAdded1.author,
                    singleCommentWasAdded1.text
                ),
                PullRequestComment(
                    pullRequestId,
                    singleCommentWasAdded2.commentId,
                    singleCommentWasAdded2.occurredAt,
                    singleCommentWasAdded2.author,
                    singleCommentWasAdded2.text
                )
            )
        }
    }
}
