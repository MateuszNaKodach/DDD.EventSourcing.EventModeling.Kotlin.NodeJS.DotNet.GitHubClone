import { EventStoreDBClient, jsonEvent, JSONEventType, ResolvedEvent } from '@eventstore/db-client';

export type MergePullRequest = {
  readonly repositoryId: string;
  readonly pullRequestId: string;
  readonly mergedBy: string;
};

type PullRequestWasMerged = JSONEventType<'PullRequestWasMerged', { repositoryId: string; pullRequestId: string; mergedBy: string }>;

type PullRequestMergingWasAllowed = JSONEventType<'PullRequestMergingWasAllowed', { repositoryId: string; pullRequestId: string }>;

type PullRequestMergingWasDisallowed = JSONEventType<'PullRequestMergingWasDisallowed', { repositoryId: string; pullRequestId: string }>;

type PullRequestEvents = PullRequestWasMerged | PullRequestMergingWasAllowed | PullRequestMergingWasDisallowed;

interface PullRequest {
  readonly status: undefined | 'notReadyToMerge' | 'readyToMerge';
}

export type MergePullRequestApplicationService = { execute: (command: MergePullRequest) => Promise<void> };

export function mergePullRequestApplicationService(eventStore: EventStoreDBClient): MergePullRequestApplicationService {
  async function execute(command: MergePullRequest) {
    const streamName = pullRequestStreamName(command.pullRequestId);

    //Read events from the past
    const history = await eventStore.readStream<PullRequestEvents>(streamName).catch(() => [] as ResolvedEvent<PullRequestEvents>[]);

    //Calculate current pull request state from past events.
    //We're interesting only in events and properties which are important in order to accept / reject the command.
    const state = history.reduce<Partial<PullRequest>>(
      (acc, { event }) => {
        switch (event?.type) {
          case 'PullRequestMergingWasAllowed':
            return {
              status: 'readyToMerge',
            };
          case 'PullRequestMergingWasDisallowed':
            return {
              status: 'notReadyToMerge',
            };
          default:
            return acc;
        }
      },
      { status: undefined },
    );

    //Check business rules if we can perform action.
    if (state.status !== 'readyToMerge') {
      throw new Error('Pull request is not ready to be merged!');
    }

    const pullRequestWasMerged = jsonEvent<PullRequestWasMerged>({
      type: 'PullRequestWasMerged',
      data: {
        repositoryId: command.repositoryId,
        pullRequestId: command.pullRequestId,
        mergedBy: command.mergedBy,
      },
    });

    //We append new events to the stream
    //ExpectedRevision "no_stream" - is first event in the stream, so we're expecting that none was appended in the meantime
    await eventStore.appendToStream(streamName, pullRequestWasMerged);
  }

  return { execute };
}

function pullRequestStreamName(pullRequestId: string) {
  return `PullRequest-${pullRequestId}`;
}
