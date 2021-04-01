package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.eventstore.dbclient.EventStoreDBClient
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import pl.zycienakodach.eventmodeling.githubclone.shared.application.ApplicationService
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.ConfigureRequiredPullRequestReviews
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.RequiredPullRequestReviewsWereConfigured
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.configureRequiredApproves
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.testsupport.WriteSliceTestSupport
import java.time.Instant
import java.util.*

@SpringBootTest
class ConfigureRequiredApprovesIntegrationTest
@Autowired constructor(
    val applicationService: ApplicationService<PullRequestReviewingDomainEvent>,
    override val eventStore: EventStoreDBClient,
    override val eventDeserializer: EventMapper<PullRequestReviewingDomainEvent>
) : WriteSliceTestSupport {

    @Test
    fun configureRequiredApprovesShouldResultsWithRequiredApprovesConfigurationUpdate() {
        //Given
        val currentTime = Instant.now()
        val randomOwner = UUID.randomUUID().toString()
        val randomRepository = UUID.randomUUID().toString()
        val repositoryId = RepositoryId(randomOwner, randomRepository)

        //When
        val configure = ConfigureRequiredPullRequestReviews(
            commandId = UUID.randomUUID(),
            issuedAt = currentTime,
            repositoryId = repositoryId.toString(),
            branch = "main",
            requiredApprovingReviews = 1
        )
        val streamName = "PullRequestReviewing-${repositoryId}"
        applicationService.execute(streamName) { history: List<PullRequestReviewingDomainEvent> -> configureRequiredApproves(history, configure) }.join()

        //Then
        assertThat(eventStore.eventsInStream(streamName)).isEqualTo(1);
        assertThat(eventStore.streamLastEvent(streamName)).isEqualTo(
            RequiredPullRequestReviewsWereConfigured(
                eventId = configure.commandId,
                occurredAt = configure.issuedAt,
                repositoryId = configure.repositoryId,
                branch = configure.branch,
                requiredApprovingReviews = configure.requiredApprovingReviews
            )
        )

        //When
        val configure2RequiredApproves = ConfigureRequiredPullRequestReviews(
            commandId = UUID.randomUUID(),
            issuedAt = currentTime,
            repositoryId = repositoryId.toString(),
            branch = "main",
            requiredApprovingReviews = 2
        )
        applicationService.execute(streamName) { history -> configureRequiredApproves(history, configure2RequiredApproves) }.join()

        //Then
        assertThat(eventStore.eventsInStream(streamName)).isEqualTo(2)
        assertThat(eventStore.streamLastEvent(streamName)).isEqualTo(
            RequiredPullRequestReviewsWereConfigured(
                eventId = configure2RequiredApproves.commandId,
                occurredAt = configure2RequiredApproves.issuedAt,
                repositoryId = configure2RequiredApproves.repositoryId,
                branch = configure2RequiredApproves.branch,
                requiredApprovingReviews = configure2RequiredApproves.requiredApprovingReviews
            )
        )
    }
}

