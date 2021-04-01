import { EventStoreDBClient, jsonEvent, JSONEventType, ResolvedEvent } from '@eventstore/db-client';

export type DisallowPullRequestMerging = {
  readonly repositoryId: string;
  readonly pullRequestId: string;
};

type PullRequestMergingWasDisallowed = JSONEventType<'PullRequestMergingWasDisallowed', { repositoryId: string; pullRequestId: string }>;

export type DisallowPullRequestMergingApplicationService = { execute: (command: DisallowPullRequestMerging) => Promise<void> };

export function disallowPullRequestMergingApplicationService(eventStore: EventStoreDBClient): DisallowPullRequestMergingApplicationService {
  async function execute(command: DisallowPullRequestMerging) {
    const streamName = pullRequestStreamName(command.pullRequestId);

    //We assume that disallowing merge is always valid - no rules to check

    const pullRequestMergingWasDisallowed = jsonEvent<PullRequestMergingWasDisallowed>({
      type: 'PullRequestMergingWasDisallowed',
      data: {
        repositoryId: command.repositoryId,
        pullRequestId: command.pullRequestId,
      },
    });

    await eventStore.appendToStream(streamName, pullRequestMergingWasDisallowed);
  }

  return { execute };
}

function pullRequestStreamName(pullRequestId: string) {
  return `PullRequest-${pullRequestId}`;
}
