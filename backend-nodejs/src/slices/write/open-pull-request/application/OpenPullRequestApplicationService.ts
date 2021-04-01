import { EventStoreDBClient, jsonEvent, JSONEventType, ResolvedEvent, START } from '@eventstore/db-client';

// EventModeling: Domain Events (Orange Post-it)
type PullRequestEvents = PullRequestWasOpened | PullRequestMergingWasAllowed;
type PullRequestWasOpened = JSONEventType<
  'PullRequestWasOpened',
  { repositoryId: string; pullRequestId: string; title: string; sourceBranch: string; targetBranch: string; author: string }
>;
type PullRequestMergingWasAllowed = JSONEventType<'PullRequestMergingWasAllowed', { repositoryId: string; pullRequestId: string }>;

//EventModeling: Commands (Blue Post-it)
export type OpenPullRequest = {
  repositoryId: string;
  pullRequestId: string;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  author: string;
};

//EventModeling: State (Not present on EventModeling, it's just implementation detail).
interface PullRequest {
  readonly status: undefined | 'notReadyToMerge' | 'readyToMerge';
}

//part of a Module / Bounded Context or at least - Slice. Simples example. With Event Sourcing and without Separation of Concerns. Fastest solution.
export type OpenPullRequestApplicationService = { execute: (command: OpenPullRequest) => Promise<void> };

export function openPullRequestApplicationService(eventStore: EventStoreDBClient): OpenPullRequestApplicationService {
  const execute: (command: OpenPullRequest) => Promise<void> = async (command: OpenPullRequest) => {
    const streamName = pullRequestStreamName(command.pullRequestId);

    //Read events from the past
    const history = await eventStore.readStream<PullRequestEvents>(streamName).catch(() => [] as ResolvedEvent<PullRequestEvents>[]);

    //Calculate current pull request state from past events.
    //Is just reduce / fold left.
    //We're interesting only in events and properties which are important in order to accept / reject the command.
    const state = history.reduce<Partial<PullRequest>>(
      (acc, { event }) => {
        switch (event?.type) {
          case 'PullRequestWasOpened':
            return {
              ...acc,
              repositoryId: event.data.repositoryId,
              pullRequestId: event.data.pullRequestId,
              status: 'notReadyToMerge',
            };
          case 'PullRequestMergingWasAllowed':
            return {
              ...acc,
              status: 'readyToMerge',
            };
          default:
            return acc;
        }
      },
      { status: undefined },
    );

    //Check business rules if we can perform action.
    if (state.status !== undefined) {
      return Promise.reject(new Error('PullRequest was already opened!'));
    }

    const pullRequestWasOpened = jsonEvent<PullRequestWasOpened>({
      type: 'PullRequestWasOpened',
      data: {
        repositoryId: command.repositoryId,
        pullRequestId: command.pullRequestId,
        title: command.title,
        sourceBranch: command.sourceBranch,
        targetBranch: command.targetBranch,
        author: command.author,
      },
    });

    //We append new events to the stream
    //ExpectedRevision "no_stream" - is first event in the stream, so we're expecting that none was appended in the meantime
    await eventStore.appendToStream(streamName, pullRequestWasOpened, { expectedRevision: 'no_stream' });
  };

  return { execute };
}

function pullRequestStreamName(pullRequestId: string) {
  return `PullRequest-${pullRequestId}`;
}
