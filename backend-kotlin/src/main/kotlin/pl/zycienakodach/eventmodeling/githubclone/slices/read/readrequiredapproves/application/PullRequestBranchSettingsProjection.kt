package pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application

import com.eventstore.dbclient.*
import org.slf4j.LoggerFactory
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.PullRequestReviewingDomainEvent
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.domain.RequiredPullRequestReviewsWereConfigured
import pl.zycienakodach.eventmodeling.githubclone.shared.application.EventMapper
import pl.zycienakodach.eventmodeling.githubclone.shared.application.Projection
import java.util.concurrent.ConcurrentLinkedQueue

class PullRequestBranchSettingsProjection(
    private val eventStore: EventStoreDBClient,
    private val eventMapper: EventMapper<PullRequestReviewingDomainEvent>,
    private val repository: PullRequestBranchSettingsRepository,
) : Projection {

    private val log = LoggerFactory.getLogger(PullRequestBranchSettingsProjection::class.java)
    private var subscriptions: ConcurrentLinkedQueue<Subscription> = ConcurrentLinkedQueue()

    override fun start() {
        eventStore.subscribeToStream(
            "\$ce-PullRequestReviewing",
            Listener(this::onEvent),
            SubscribeToStreamOptions.get().fromStart().resolveLinkTos()
        ).thenApply(this::onSubscribed)
    }

    private fun onEvent(resolvedEvent: ResolvedEvent) {
        when (val domainEvent = eventMapper.toDomainEvent(resolvedEvent.event)) {
            is RequiredPullRequestReviewsWereConfigured -> {
                val settings = PullRequestBranchSettings(
                    repositoryId = domainEvent.repositoryId,
                    branch = domainEvent.branch,
                    requiredApprovingReviews = domainEvent.requiredApprovingReviews
                )
                repository.save(settings)
                log.info("Event consumed by projection: {}", domainEvent)
            }
            else -> log.info("Event ignored by projection: {}", resolvedEvent.event.eventType)
        }
    }

    private fun onSubscribed(subscription: Subscription) {
        log.info("Subscription with id ${subscription.subscriptionId} started.")
        subscriptions.add(subscription)
    }

    private class Listener(private val handler: (event: ResolvedEvent) -> Any) : SubscriptionListener() {

        private val log = LoggerFactory.getLogger(PullRequestBranchSettingsProjection::class.java)

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
