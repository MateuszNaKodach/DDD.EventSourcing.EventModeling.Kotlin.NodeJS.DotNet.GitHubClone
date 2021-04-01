package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application

import com.eventstore.dbclient.*
import org.slf4j.LoggerFactory
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.RequiredPullRequestReviewsWereConfigured
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.application.Projection
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.domain.CommentDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.domain.SingleCommentWasAdded
import java.util.concurrent.ConcurrentLinkedQueue

class PullRequestCommentsProjection(
    private val eventStore: EventStoreDBClient,
    private val eventMapper: EventMapper<CommentDomainEvent>,
    private val repository: PullRequestCommentsRepository,
) : Projection {

    private val log = LoggerFactory.getLogger(PullRequestCommentsProjection::class.java)
    private var subscriptions: ConcurrentLinkedQueue<Subscription> = ConcurrentLinkedQueue()

    override fun start() {
        eventStore.subscribeToStream(
            "\$ce-PullRequestComment",
            Listener(this::onEvent),
            SubscribeToStreamOptions.get().fromStart().resolveLinkTos()
        ).thenApply(this::onSubscribed)
    }

    private fun onEvent(resolvedEvent: ResolvedEvent) {
        try {
            when (val domainEvent = eventMapper.toDomainEvent(resolvedEvent.event)) {
                is SingleCommentWasAdded -> {
                    val comment = PullRequestComment(
                        domainEvent.pullRequestId,
                        domainEvent.commentId,
                        domainEvent.occurredAt,
                        domainEvent.author,
                        domainEvent.text
                    )
                    repository.save(comment)
                    log.info("Event consumed by projection: {}", domainEvent)
                }
                else -> log.info("Event ignored by projection: {}", resolvedEvent.event.eventType)
            }
        } catch (e: Exception) {
            log.error("Error while handling event of type: {}", resolvedEvent.event.eventType)
        }
    }

    private fun onSubscribed(subscription: Subscription) {
        log.info("Subscription with id ${subscription.subscriptionId} started.")
        subscriptions.add(subscription)
    }

    private class Listener(private val handler: (event: ResolvedEvent) -> Any) : SubscriptionListener() {

        private val log = LoggerFactory.getLogger(PullRequestCommentsProjection::class.java)

        override fun onEvent(subscription: Subscription, event: ResolvedEvent) {
            handler(event)
        }

        override fun onCancelled(subscription: Subscription) {
            log.info("EventStore Subscription with id ${subscription.subscriptionId} is cancelled.")
        }
    }

    override fun stop() {
        subscriptions.forEach { subscription ->
            subscription.stop()
            log.info("EventStore Subscription with id ${subscription.subscriptionId} stopped.")
        }
    }
}
