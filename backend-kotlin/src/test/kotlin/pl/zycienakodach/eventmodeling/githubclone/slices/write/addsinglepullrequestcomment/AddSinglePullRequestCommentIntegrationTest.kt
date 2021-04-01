package pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment

import assertk.assertThat
import assertk.assertions.isEqualTo
import assertk.assertions.isFailure
import assertk.assertions.messageContains
import com.eventstore.dbclient.EventStoreDBClient
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import pl.zycienakodach.eventmodeling.githubclone.shared.application.ApplicationService
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.AddSingleComment
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.CommentDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.SingleCommentWasAdded
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.addSingleComment
import pl.zycienakodach.eventmodeling.githubclone.testsupport.WriteSliceTestSupport
import java.time.Instant
import java.util.*

/**
 * Najlepszy rodzaj testów. Wrzucamy Command do warstwy Application - oczekujemy Event na wyjściu.
 * Powinniśmy jeszcze przetestować czy Controller właściwie deleguje prace do Application.
 */
@SpringBootTest
class AddSinglePullRequestCommentIntegrationTest
@Autowired constructor(
    val applicationService: ApplicationService<CommentDomainEvent>,
    override val eventStore: EventStoreDBClient,
    override val eventDeserializer: EventMapper<CommentDomainEvent>
) : WriteSliceTestSupport {


    @Test
    fun `should add comment if not exists`() {
        //Given
        val currentTime = Instant.now()
        val randomOwner = UUID.randomUUID().toString()
        val randomRepository = UUID.randomUUID().toString()
        val repositoryId = RepositoryId(randomOwner, randomRepository)
        val commentId = UUID.randomUUID().toString()
        val pullRequestId = UUID.randomUUID().toString()
        val commandId = UUID.randomUUID()

        //When
        val command = AddSingleComment(
            commentId = commentId,
            commandId = commandId,
            issuedAt = currentTime,
            repositoryId = repositoryId.toString(),
            pullRequestId = pullRequestId,
            text = "Comment text. Lorem ipsum",
            author = "john.kovalsky"
        )
        val streamName = "PullRequestComment-${commandId}"
        applicationService.execute(streamName)
        { history -> addSingleComment(history, command) }.join()

        //Then
        assertThat(eventStore.eventsInStream(streamName)).isEqualTo(1);
        assertThat(eventStore.streamLastEvent(streamName)).isEqualTo(
            SingleCommentWasAdded(
                eventId = commandId,
                occurredAt = currentTime,
                repositoryId = repositoryId.toString(),
                pullRequestId = pullRequestId,
                commentId = commentId,
                text = command.text,
                author = command.author
            )
        )
    }

    @Test
    fun `should not add comment if exists`() {
        //Given
        val currentTime = Instant.now()
        val randomOwner = UUID.randomUUID().toString()
        val randomRepository = UUID.randomUUID().toString()
        val repositoryId = RepositoryId(randomOwner, randomRepository)
        val commentId = UUID.randomUUID().toString()
        val pullRequestId = UUID.randomUUID().toString()
        val commandId = UUID.randomUUID()

        val command = AddSingleComment(
            commentId = commentId,
            commandId = commandId,
            issuedAt = currentTime,
            repositoryId = repositoryId.toString(),
            pullRequestId = pullRequestId,
            text = "Comment text. Lorem ipsum",
            author = "john.kovalsky"
        )
        val streamName = "PullRequestComment-${commandId}"
        applicationService.execute(streamName)
        { history -> addSingleComment(history, command) }.join()

        //Then
        assertThat {
            applicationService.execute(streamName)
            { history -> addSingleComment(history, command) }.join()
        }.isFailure().messageContains("Comment already exists!")

        assertThat(eventStore.eventsInStream(streamName)).isEqualTo(1)
    }


}
