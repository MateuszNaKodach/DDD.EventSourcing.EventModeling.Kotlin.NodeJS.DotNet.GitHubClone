package pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.application

import com.eventstore.dbclient.EventStoreDBClient
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.EventStoreApplicationService
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.JsonEventMapper
import pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.approvepullrequest.domain.PullRequestWasApproved
import kotlin.reflect.KClass

@Configuration
class ApprovePullRequestApplication(
    private val objectMapper: ObjectMapper,
    private val eventStore: EventStoreDBClient
) {

    @Bean
    fun approvePullRequestEventMapper(): EventMapper<PullRequestReviewingDomainEvent> {
        val eventTypesMapping = mapOf<String, KClass<out PullRequestReviewingDomainEvent>>(
            "PullRequestWasApproved" to PullRequestWasApproved::class
        )
        return JsonEventMapper(objectMapper, eventTypesMapping)
    }

    @Bean
    fun approvePullRequestApplicationService(eventMapper: EventMapper<PullRequestReviewingDomainEvent>): EventStoreApplicationService<PullRequestReviewingDomainEvent> =
        EventStoreApplicationService(eventStore, eventMapper)
}
