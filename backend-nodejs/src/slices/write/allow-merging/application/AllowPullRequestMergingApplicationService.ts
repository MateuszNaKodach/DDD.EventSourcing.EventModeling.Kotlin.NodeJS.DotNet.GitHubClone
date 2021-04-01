import { EventStoreDBClient, jsonEvent, JSONEventType, ResolvedEvent } from '@eventstore/db-client';

export type AllowPullRequestMerging = {
  readonly repositoryId: string;
  readonly pullRequestId: string;
};

type PullRequestMergingWasAllowed = JSONEventType<'PullRequestMergingWasAllowed', { repositoryId: string; pullRequestId: string }>;

export type AllowPullRequestMergingApplicationService = { execute: (command: AllowPullRequestMerging) => Promise<void> };

export function allowPullRequestMergingApplicationService(eventStore: EventStoreDBClient): AllowPullRequestMergingApplicationService {
  async function execute(command: AllowPullRequestMerging) {
    const streamName = pullRequestStreamName(command.pullRequestId);

    //We assume that allowing merge is always valid - no rules to check

    const pullRequestMergingWasAllowed = jsonEvent<PullRequestMergingWasAllowed>({
      type: 'PullRequestMergingWasAllowed',
      data: {
        repositoryId: command.repositoryId,
        pullRequestId: command.pullRequestId,
      },
    });

    await eventStore.appendToStream(streamName, pullRequestMergingWasAllowed);
  }

  return { execute };
}

function pullRequestStreamName(pullRequestId: string) {
  return `PullRequest-${pullRequestId}`;
}
