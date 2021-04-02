package pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.application

import com.eventstore.dbclient.EventStoreDBClient
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.EventStoreApplicationService
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.JsonEventMapper
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.CommentDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.domain.SingleCommentWasAdded
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.write.configurerequiredapproves.domain.RequiredPullRequestReviewsWereConfigured
import kotlin.reflect.KClass

@Configuration
class ConfigureRequiredApprovesApplication(
    private val objectMapper: ObjectMapper,
    private val eventStore: EventStoreDBClient
) {

    @Bean
    fun pullRequestReviewingEventMapper(): EventMapper<PullRequestReviewingDomainEvent> {
        val eventTypesMapping = mapOf<String, KClass<out PullRequestReviewingDomainEvent>>(
            "RequiredPullRequestReviewsWereConfigured" to RequiredPullRequestReviewsWereConfigured::class
        )
        return JsonEventMapper(objectMapper, eventTypesMapping)
    }

    @Bean
    fun pullRequestReviewingApplicationService(eventMapper: EventMapper<PullRequestReviewingDomainEvent>): EventStoreApplicationService<PullRequestReviewingDomainEvent> =
        EventStoreApplicationService(eventStore, eventMapper)
}
