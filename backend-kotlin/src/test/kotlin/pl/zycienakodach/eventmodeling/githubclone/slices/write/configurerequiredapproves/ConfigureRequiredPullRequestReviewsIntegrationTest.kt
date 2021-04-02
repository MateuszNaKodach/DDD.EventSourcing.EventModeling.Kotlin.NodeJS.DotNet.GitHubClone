package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.eventstore.dbclient.EventStoreDBClient
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import pl.zycienakodach.eventmodeling.githubclone.shared.application.ApplicationService
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.ConfigureRequiredPullRequestReviews
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.RequiredPullRequestReviewsWereConfigured
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.configureRequiredPullRequestReviews

import pl.zycienakodach.eventmodeling.githubclone.testsupport.WriteSliceTestSupport
import java.time.Instant
import java.util.*

@SpringBootTest
class ConfigureRequiredPullRequestReviewsIntegrationTest
@Autowired constructor(
    val applicationService: ApplicationService<PullRequestReviewingDomainEvent>,
    override val eventStore: EventStoreDBClient,
    override val eventDeserializer: EventMapper<PullRequestReviewingDomainEvent>
) : WriteSliceTestSupport {

    @Test
    fun `configure required pull request reviews`() {
        //Given
        val currentTime = Instant.now()
        val randomOwner = UUID.randomUUID().toString()
        val randomRepository = UUID.randomUUID().toString()
        val repositoryId = RepositoryId(randomOwner, randomRepository)
        val commandId = UUID.randomUUID()

        //When
        val command = ConfigureRequiredPullRequestReviews(
            commandId = commandId,
            issuedAt = currentTime,
            repositoryId = repositoryId.toString(),
            branch = "develop",
            requiredApprovingReviews = 2
        )
        val streamName = "PullRequestReviewing-${repositoryId}"
        applicationService.execute(streamName)
        { history -> configureRequiredPullRequestReviews(history, command) }.join()

        //Then
        assertThat(eventStore.eventsInStream(streamName)).isEqualTo(1);
        assertThat(eventStore.streamLastEvent(streamName)).isEqualTo(
            RequiredPullRequestReviewsWereConfigured(
                eventId = commandId,
                occurredAt = currentTime,
                repositoryId = repositoryId.toString(),
                branch = "develop",
                requiredApprovingReviews = 2
            )
        )
    }
}
