package pl.zycienakodach.eventmodeling.githubclone.slices.write.addsinglepullrequestcomment.application

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
import kotlin.reflect.KClass

@ConditionalOnProperty(value = ["event-modeling.github-clone.slices.write.add-single-pull-request-comment.enabled"], havingValue = "true")
@Configuration
class AddSingleCommentApplication(
    private val objectMapper: ObjectMapper,
    private val eventStore: EventStoreDBClient
) {

    @Bean
    fun addSingleCommentEventMapper(): EventMapper<CommentDomainEvent> {
        val eventTypesMapping = mapOf<String, KClass<out CommentDomainEvent>>(
            "SingleCommentWasAdded" to SingleCommentWasAdded::class
        )
        return JsonEventMapper(objectMapper, eventTypesMapping)
    }

    @Bean
    fun addSingleCommentApplicationService(eventMapper: EventMapper<CommentDomainEvent>): EventStoreApplicationService<CommentDomainEvent> =
        EventStoreApplicationService(eventStore, eventMapper)
}
