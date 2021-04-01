import { UuidEntityIdGenerator } from '../../../../src/shared/infrastructure/UuidEntityIdGenerator';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import {
  MergePullRequest,
  mergePullRequestApplicationService,
} from '../../../../src/slices/write/merge-pull-request/application/MergePullRequestApplicationService';
import { streamLastEvent } from '../../../test-support/EventStoreSupport';

describe('Merge Pull Request', () => {
  const idGenerator = new UuidEntityIdGenerator();

  test('when try to merge just opened pull request, then pull request should not be merged', async () => {
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const sut = mergePullRequestApplicationService(eventStore);

    const command: MergePullRequest = {
      repositoryId: idGenerator.generate(),
      pullRequestId: idGenerator.generate(),
      mergedBy: 'MergingUser',
    };

    await expect(sut.execute(command)).rejects.toStrictEqual(new Error('Pull request is not ready to be merged!'));
  });

  test('given pull request allowed to merge, when try to merge, then pull request should be merged', async () => {
    //Given
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const sut = mergePullRequestApplicationService(eventStore);

    const repositoryId = idGenerator.generate();
    const pullRequestId = idGenerator.generate();

    const pullRequestWasOpened = jsonEvent({
      type: 'PullRequestWasOpened',
      data: {
        repositoryId,
        pullRequestId,
        title: 'Sample pull request title',
        sourceBranch: 'develop',
        targetBranch: 'main',
        author: 'nowakprojects',
      },
    });
    const pullRequestMergingWasAllowed = jsonEvent({
      type: 'PullRequestMergingWasAllowed',
      data: {
        repositoryId,
        pullRequestId,
      },
    });
    await eventStore.appendToStream(`PullRequest-${pullRequestId}`, [pullRequestWasOpened, pullRequestMergingWasAllowed]);

    //When
    const command: MergePullRequest = {
      repositoryId: repositoryId,
      pullRequestId: pullRequestId,
      mergedBy: 'MergingUser',
    };

    await sut.execute(command);

    //Then
    const lastStoredEvent = await streamLastEvent(eventStore, `PullRequest-${command.pullRequestId}`);
    expect(lastStoredEvent.event?.type).toBe('PullRequestWasMerged');
    expect(lastStoredEvent.event?.data).toStrictEqual({
      repositoryId: command.repositoryId,
      pullRequestId: command.pullRequestId,
      mergedBy: command.mergedBy,
    });
  });
});
