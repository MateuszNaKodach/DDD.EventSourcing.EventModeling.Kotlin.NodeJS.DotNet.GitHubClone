package pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application

import com.eventstore.dbclient.EventStoreDBClient
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.RequiredPullRequestReviewsWereConfigured
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.infrastructure.PullRequestBranchSettingsInMemoryRepository
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.JsonEventMapper
import kotlin.reflect.KClass

@Configuration
class BranchSettingsProjectionConfig(
    private val eventStore: EventStoreDBClient,
    private val objectMapper: ObjectMapper
) {

    @Bean
    fun reviewsBranchingEventMapper(): EventMapper<PullRequestReviewingDomainEvent> {
        val eventTypesMapping = mapOf<String, KClass<out PullRequestReviewingDomainEvent>>(
            "RequiredPullRequestReviewsWereConfigured" to RequiredPullRequestReviewsWereConfigured::class
        )
        return JsonEventMapper(objectMapper, eventTypesMapping);
    }

    @Bean
    fun pullRequestBranchSettingsRepository(): PullRequestBranchSettingsRepository = PullRequestBranchSettingsInMemoryRepository()

    @Bean
    fun pullRequestBranchSettingsProjection(
        reviewsBranchingEventMapper: EventMapper<PullRequestReviewingDomainEvent>,
        pullRequestBranchSettingsRepository: PullRequestBranchSettingsRepository
    ): PullRequestBranchSettingsProjection {
        return PullRequestBranchSettingsProjection(eventStore, reviewsBranchingEventMapper, pullRequestBranchSettingsRepository)
    }

}

