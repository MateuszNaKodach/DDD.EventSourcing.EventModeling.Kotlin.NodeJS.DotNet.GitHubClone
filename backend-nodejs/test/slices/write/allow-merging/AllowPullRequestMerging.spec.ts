import { UuidEntityIdGenerator } from '../../../../src/shared/infrastructure/UuidEntityIdGenerator';
import { EventStoreDBClient } from '@eventstore/db-client';
import { streamLastEvent } from '../../../test-support/EventStoreSupport';
import {
  AllowPullRequestMerging,
  allowPullRequestMergingApplicationService,
} from '../../../../src/slices/write/allow-merging/application/AllowPullRequestMergingApplicationService';

describe('Allow pull request merging', () => {
  const idGenerator = new UuidEntityIdGenerator();

  test('should result in PullRequestMergingWasAllowed', async () => {
    //Given
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const sut = allowPullRequestMergingApplicationService(eventStore);

    const repositoryId = idGenerator.generate();
    const pullRequestId = idGenerator.generate();

    //When
    const command: AllowPullRequestMerging = {
      repositoryId: repositoryId,
      pullRequestId: pullRequestId,
    };

    await sut.execute(command);

    //Then
    const lastStoredEvent = await streamLastEvent(eventStore, `PullRequest-${command.pullRequestId}`);
    expect(lastStoredEvent.event?.type).toBe('PullRequestMergingWasAllowed');
    expect(lastStoredEvent.event?.data).toStrictEqual({ repositoryId, pullRequestId });
  });
});
