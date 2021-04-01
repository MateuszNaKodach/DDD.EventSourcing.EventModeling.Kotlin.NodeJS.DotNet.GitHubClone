import { EventStoreDBClient, JSONEventType, JSONRecordedEvent, ReadableSubscription, ResolvedEvent } from '@eventstore/db-client';
import { PullRequestRepository } from './PullRequestRepository';
import { Projection } from '../../../../shared/application/Projection';

type PullRequestEvent = PullRequestWasOpened | PullRequestMergingWasAllowed | PullRequestWasMerged | PullRequestMergingWasDisallowed;

type PullRequestWasOpened = JSONEventType<
  'PullRequestWasOpened',
  { repositoryId: string; pullRequestId: string; title: string; sourceBranch: string; targetBranch: string; author: string; openedAt: Date }
>;
type PullRequestMergingWasAllowed = JSONEventType<'PullRequestMergingWasAllowed', { repositoryId: string; pullRequestId: string }>;
type PullRequestMergingWasDisallowed = JSONEventType<'PullRequestMergingWasDisallowed', { repositoryId: string; pullRequestId: string }>;
type PullRequestWasMerged = JSONEventType<'PullRequestWasMerged', { repositoryId: string; pullRequestId: string }>;

export type PullRequest = {
  repositoryId: string;
  pullRequestId: string;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  //openedAt: Date;
  status: 'notReadyToMerge' | 'readyToMerge' | 'merged';
  author: string;
};

export function pullRequestsProjector(eventStore: EventStoreDBClient, repository: PullRequestRepository): Projection {
  let subscription: ReadableSubscription<ResolvedEvent<PullRequestEvent>>;

  async function handleEvent(
    event:
      | JSONRecordedEvent<PullRequestWasOpened>
      | JSONRecordedEvent<PullRequestMergingWasAllowed>
      | JSONRecordedEvent<PullRequestWasMerged>
      | JSONRecordedEvent<PullRequestMergingWasDisallowed>
      | undefined,
  ) {
    if (!event || !event.isJson) {
      return;
    }
    switch (event.type) {
      case 'PullRequestWasOpened':
        await repository.save({
          ...event.data,
          status: 'notReadyToMerge',
        });
        return;
      case 'PullRequestMergingWasAllowed':
        const readyToMergePullRequest = await repository.findById(event.data.pullRequestId);
        if (!readyToMergePullRequest) {
          return;
        }
        if (readyToMergePullRequest.status !== 'merged') {
          readyToMergePullRequest.status = 'readyToMerge';
        }
        await repository.save(readyToMergePullRequest);
        return;
      case 'PullRequestMergingWasDisallowed':
        const notReadyToMergePullRequest = await repository.findById(event.data.pullRequestId);
        if (!notReadyToMergePullRequest) {
          return;
        }
        if (notReadyToMergePullRequest.status !== 'merged') {
          notReadyToMergePullRequest.status = 'notReadyToMerge';
        }
        await repository.save(notReadyToMergePullRequest);
        return;
      case 'PullRequestWasMerged':
        const mergedPullRequest = await repository.findById(event.data.pullRequestId);
        if (!mergedPullRequest) {
          return;
        }
        mergedPullRequest.status = 'merged';
        await repository.save(mergedPullRequest);
        return;
    }
  }

  async function start() {
    subscription = eventStore
      .subscribeToStream<PullRequestEvent>('$ce-PullRequest', { fromRevision: 'start', resolveLinkTos: true })
      .on('data', ({ event }) => handleEvent(event));

    console.log('PullRequestsProjector started.');
  }

  async function stop() {
    await subscription.unsubscribe();
    console.log('PullRequestsProjector stopped.');
  }

  return { start, stop };
}
