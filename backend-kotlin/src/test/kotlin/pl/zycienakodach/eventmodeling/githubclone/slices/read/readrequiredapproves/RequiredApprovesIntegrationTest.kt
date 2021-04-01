package pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves

import assertk.assertThat
import assertk.assertions.isEqualTo
import com.eventstore.dbclient.EventStoreDBClient
import org.awaitility.Awaitility.await
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventSerializer
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application.PullRequestBranchSettings
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application.PullRequestBranchSettingsRepository
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.RequiredPullRequestReviewsWereConfigured
import pl.zycienakodach.eventmodeling.githubclone.testsupport.ReadSliceTestSupport
import java.time.Clock
import java.util.*

@SpringBootTest
class RequiredApprovesIntegrationTest
@Autowired constructor(
    val repository: PullRequestBranchSettingsRepository,
    override val eventSerializer: EventSerializer<PullRequestReviewingDomainEvent>,
    override val eventStore: EventStoreDBClient,
    val clock: Clock
) : ReadSliceTestSupport<PullRequestReviewingDomainEvent> {

    @Test
    internal fun shouldBeUpdatedAfterRequiredPullRequestReviewsWereConfigured() {
        //When
        val randomOwner = UUID.randomUUID().toString()
        val randomRepository = UUID.randomUUID().toString()
        val repositoryId = RepositoryId(randomOwner, randomRepository)
        val streamName = "PullRequestReviewing-${repositoryId}"

        val configured3 = RequiredPullRequestReviewsWereConfigured(
            eventId = UUID.randomUUID(),
            occurredAt = clock.instant(),
            repositoryId = repositoryId.toString(),
            branch = "main",
            requiredApprovingReviews = 3
        )
        eventStore.publish(streamName, configured3)

        //Then
        await().untilAsserted {
            assertThat(repository.findBy(repositoryId.toString(), "main")).isEqualTo(
                PullRequestBranchSettings(
                    repositoryId = repositoryId.toString(),
                    branch = "main",
                    requiredApprovingReviews = 3
                )
            )
        }

        //When
        val configured1 = RequiredPullRequestReviewsWereConfigured(
            eventId = UUID.randomUUID(),
            occurredAt = clock.instant(),
            repositoryId = repositoryId.toString(),
            branch = "main",
            requiredApprovingReviews = 1
        )
        eventStore.publish(streamName, configured1)

        //Then
        await().untilAsserted {
            assertThat(repository.findBy(repositoryId.toString(), "main")).isEqualTo(
                PullRequestBranchSettings(
                    repositoryId = repositoryId.toString(),
                    branch = "main",
                    requiredApprovingReviews = 1
                )
            )
        }

    }
}
