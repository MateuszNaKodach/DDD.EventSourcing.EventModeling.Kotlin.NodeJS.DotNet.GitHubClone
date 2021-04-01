import {
  OpenPullRequest,
  openPullRequestApplicationService,
} from '../../../../src/slices/write/open-pull-request/application/OpenPullRequestApplicationService';
import { BACKWARDS, EventStoreDBClient } from '@eventstore/db-client';
import { UuidEntityIdGenerator } from '../../../../src/shared/infrastructure/UuidEntityIdGenerator';
import { eventsInStream, streamLastEvent } from '../../../test-support/EventStoreSupport';

describe('OpenPullRequestModule', () => {
  const idGenerator = new UuidEntityIdGenerator();

  it('when open not opened pull request then pull request should be opened', async () => {
    //Given
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const sut = openPullRequestApplicationService(eventStore);

    //When
    const command: OpenPullRequest = {
      repositoryId: idGenerator.generate(),
      pullRequestId: idGenerator.generate(),
      title: 'Sample pull request title',
      sourceBranch: 'develop',
      targetBranch: 'main',
      author: 'nowakprojects',
    };
    await sut.execute(command);

    //Then
    const lastStoredEvent = await streamLastEvent(eventStore, `PullRequest-${command.pullRequestId}`);
    expect(lastStoredEvent.event?.type).toBe('PullRequestWasOpened');
    expect(lastStoredEvent.event?.data).toStrictEqual({
      repositoryId: command.repositoryId,
      pullRequestId: command.pullRequestId,
      title: command.title,
      sourceBranch: command.sourceBranch,
      targetBranch: command.targetBranch,
      author: command.author,
    });
  });

  it('when open already opened pull request then pull request should not be opened once more', async () => {
    //Given
    const eventStore = EventStoreDBClient.connectionString('esdb://localhost:2113?tls=false');
    const sut = openPullRequestApplicationService(eventStore);

    const command: OpenPullRequest = {
      repositoryId: idGenerator.generate(),
      pullRequestId: idGenerator.generate(),
      title: 'Sample pull request title',
      sourceBranch: 'develop',
      targetBranch: 'main',
      author: 'nowakprojects',
    };
    await sut.execute(command);

    //When
    await expect(sut.execute(command)).rejects.toStrictEqual(new Error('PullRequest was already opened!'));

    //Then
    expect(await eventsInStream(eventStore, `PullRequest-${command.pullRequestId}`)).toBe(1);
  });
});

/*beforeAll(async () => {
  eventStoreContainer = await new GenericContainer("eventstore/eventstore:latest")
      .withExposedPorts(1113, 2113)
      .withEnv("EVENTSTORE_INSECURE", "true")
      .withEnv("EVENTSTORE_RUN_PROJECTIONS", "All")
      .withEnv("EVENTSTORE_START_STANDARD_PROJECTIONS", "true")
      .withEnv("EVENTSTORE_ENABLE_ATOM_PUB_OVER_HTTP", "true")
      .start();
  const stream = await eventStoreContainer.logs();
  stream
      .on("data", line => console.log(line))
      .on("err", line => console.error(line))
      .on("end", () => console.log("Stream closed"));
})

afterAll(async () => {
  await eventStoreContainer.stop();
});*/
