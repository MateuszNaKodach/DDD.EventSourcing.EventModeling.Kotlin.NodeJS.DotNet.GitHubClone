package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application

import com.eventstore.dbclient.EventStoreDBClient
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure.JsonEventMapper
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.domain.CommentDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.domain.SingleCommentWasAdded
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.infrastructure.InMemoryPullRequestCommentsRepository
import kotlin.reflect.KClass

@ConditionalOnProperty(value = ["event-modeling.github-clone.slices.read.pull-request-comments.enabled"], havingValue = "true")
@Configuration
class PullRequestCommentsProjectionConfig(
    private val eventStore: EventStoreDBClient,
    private val objectMapper: ObjectMapper
) {

    @Bean
    fun pullRequestCommentsEventMapper(): EventMapper<CommentDomainEvent> {
        val eventTypesMapping = mapOf<String, KClass<out CommentDomainEvent>>(
            "SingleCommentWasAdded" to SingleCommentWasAdded::class
        )
        return JsonEventMapper(objectMapper, eventTypesMapping);
    }

    @Bean
    fun pullRequestCommentsRepository(): PullRequestCommentsRepository = InMemoryPullRequestCommentsRepository()

    @Bean
    fun pullRequestCommentsProjection(
        pullRequestCommentsEventMapper: EventMapper<CommentDomainEvent>,
        pullRequestCommentsRepository: PullRequestCommentsRepository
    ): PullRequestCommentsProjection {
        return PullRequestCommentsProjection(eventStore, pullRequestCommentsEventMapper, pullRequestCommentsRepository)
    }

}

