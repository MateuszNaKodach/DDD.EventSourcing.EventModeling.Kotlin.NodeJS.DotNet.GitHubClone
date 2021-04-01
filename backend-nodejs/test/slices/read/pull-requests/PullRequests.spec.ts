import { BACKWARDS, EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { UuidEntityIdGenerator } from '../../../../src/shared/infrastructure/UuidEntityIdGenerator';
import { pullRequestsProjector } from '../../../../src/slices/read/pull-requests/application/PullRequestsProjector';
import waitForExpect from 'wait-for-expect';
import { InMemoryPullRequestRepository } from '../../../../src/slices/read/pull-requests/infrastructure/InMemoryPullRequestRepository';

describe('Opened Pull Requests Read Model', () => {
  const idGenerator = new UuidEntityIdGenerator();

  test('when pull request was opened', async () => {
    //Given
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const repository = new InMemoryPullRequestRepository();
    const sut = pullRequestsProjector(eventStore, repository);
    sut.start();

    //When
    const repositoryId = idGenerator.generate();
    const pullRequestId = idGenerator.generate();
    const pullRequestOpenedAt = new Date();
    const pullRequestWasOpened = jsonEvent({
      type: 'PullRequestWasOpened',
      data: {
        repositoryId,
        pullRequestId,
        title: 'Sample pull request title',
        sourceBranch: 'develop',
        targetBranch: 'main',
        author: 'nowakprojects',
        //    openedAt: pullRequestOpenedAt
      },
    });
    await eventStore.appendToStream(`PullRequest-${pullRequestId}`, pullRequestWasOpened);

    //Then
    await waitForExpect(() => expect(repository.findById(pullRequestId)).resolves.toBeDefined());
    expect(await repository.findById(pullRequestId)).toStrictEqual({
      repositoryId,
      pullRequestId,
      title: 'Sample pull request title',
      sourceBranch: 'develop',
      targetBranch: 'main',
      author: 'nowakprojects',
      status: 'notReadyToMerge',
      //   openedAt: pullRequestOpenedAt
    });

    //Cleanup
    await sut.stop();
  });

  test('when pull request was opened and merged', async () => {
    //Given
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const repository = new InMemoryPullRequestRepository();
    const sut = pullRequestsProjector(eventStore, repository);
    sut.start();

    //When
    const repositoryId = idGenerator.generate();
    const pullRequestId = idGenerator.generate();
    const pullRequestOpenedAt = new Date();
    const pullRequestWasOpened = jsonEvent({
      type: 'PullRequestWasOpened',
      data: {
        repositoryId,
        pullRequestId,
        title: 'Sample pull request title',
        sourceBranch: 'develop',
        targetBranch: 'main',
        author: 'nowakprojects',
        //   openedAt: pullRequestOpenedAt
      },
    });
    await eventStore.appendToStream(`PullRequest-${pullRequestId}`, pullRequestWasOpened);

    const pullRequestWasMerged = jsonEvent({
      type: 'PullRequestWasMerged',
      data: {
        repositoryId,
        pullRequestId,
      },
    });

    await eventStore.appendToStream(`PullRequest-${pullRequestId}`, pullRequestWasMerged);

    //Then
    await waitForExpect(() =>
      expect(repository.findById(pullRequestId)).resolves.toStrictEqual({
        repositoryId,
        pullRequestId,
        title: 'Sample pull request title',
        sourceBranch: 'develop',
        targetBranch: 'main',
        author: 'nowakprojects',
        status: 'merged',
        // openedAt: pullRequestOpenedAt
      }),
    );

    //Cleanup
    await sut.stop();
  });
});
