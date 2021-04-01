import { UuidEntityIdGenerator } from '../../../../../src/shared/infrastructure/UuidEntityIdGenerator';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import waitForExpect from 'wait-for-expect';
import { allowPullRequestMergingWhenOpenedAutomation } from '../../../../../src/slices/automation/allow-pull-request-merging/when-pull-request-was-opened/application/PullRequestIsReadyWhenOpened';
import { AllowPullRequestMergingTaskExecutor } from '../../../../../src/slices/automation/allow-pull-request-merging/when-pull-request-was-opened/application/AllowPullRequestMergingTaskExecutor';

//TODO: How to test removing from todo list?
describe('Pull Request Ready When Opened | Automatization', () => {
  const idGenerator = new UuidEntityIdGenerator();

  test('when pull request was opened', async () => {
    //Given
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const taskExecutor: AllowPullRequestMergingTaskExecutor = {
      execute: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    const sut = allowPullRequestMergingWhenOpenedAutomation(eventStore, taskExecutor);
    sut.start();

    //When
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
    await eventStore.appendToStream(`PullRequest-${pullRequestId}`, pullRequestWasOpened);

    //Then
    await waitForExpect(() => expect(taskExecutor.execute).toBeCalledWith({ repositoryId, pullRequestId }));

    //Cleanup
    await sut.stop();
  });
});
