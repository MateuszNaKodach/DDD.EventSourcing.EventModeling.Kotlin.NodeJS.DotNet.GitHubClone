import express, { Express } from 'express';
import YAML from 'yamljs';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { openPullRequestRestApi } from './write/open-pull-request/presentation/OpenPullRequestRestApi';
import { openPullRequestApplicationService } from './write/open-pull-request/application/OpenPullRequestApplicationService';
import { EventStoreDBClient } from '@eventstore/db-client';
import { EntityIdGenerator } from '../shared/application/EntityIdGenerator';
import { UuidEntityIdGenerator } from '../shared/infrastructure/UuidEntityIdGenerator';
import { allowPullRequestMergingApplicationService } from './write/allow-merging/application/AllowPullRequestMergingApplicationService';
import { allowPullRequestMergingWhenOpenedAutomation } from './automation/allow-pull-request-merging/when-pull-request-was-opened/application/PullRequestIsReadyWhenOpened';
import { InMemoryAllowPullRequestMergingTaskExecutor } from './automation/allow-pull-request-merging/when-pull-request-was-opened/infrastructure/InMemoryAllowPullRequestMergingTaskExecutor';
import { mergePullRequestApplicationService } from './write/merge-pull-request/application/MergePullRequestApplicationService';
import { mergePullRequestRestApi } from './write/merge-pull-request/presentation/MergePullRequestRestApi';
import cors from 'cors';
import { pullRequestsProjector } from './read/pull-requests/application/PullRequestsProjector';
import { InMemoryPullRequestRepository } from './read/pull-requests/infrastructure/InMemoryPullRequestRepository';
import { pullRequestsRestApi } from './read/pull-requests/presentation/PullRequestsRestApi';
import { allowPullRequestMergingRestApi } from './write/allow-merging/presentation/AllowPullRequestMergingRestApi';
import { disallowPullRequestMergingApplicationService } from './write/disallow-merging/application/DisallowPullRequestMergingApplicationService';
import { disallowPullRequestMergingRestApi } from './write/disallow-merging/presentation/DisallowPullRequestMergingRestApi';

export type Slices = { restApi: Express };

export async function runSlices(): Promise<Slices> {
  const swaggerDocument = YAML.load('./src/slices/rest-api-docs.yaml');
  const server = express();
  server.use(bodyParser.json());
  server.use(cors());

  //-Infrastructure Layer
  const eventStore = EventStoreDBClient.connectionString(process.env.EVENTSTORE_CONNECTION_STRING ?? 'esdb://localhost:2113?tls=false');
  const idGenerator: EntityIdGenerator = new UuidEntityIdGenerator();

  //-Core (Application + Domain Layer) - Capabilities
  const openPullRequest = openPullRequestApplicationService(eventStore);
  const allowPullRequestMerging = allowPullRequestMergingApplicationService(eventStore);
  const disallowPullRequestMerging = disallowPullRequestMergingApplicationService(eventStore);
  const mergePullRequest = mergePullRequestApplicationService(eventStore);

  //--ReadModel
  const pullRequestRepository = new InMemoryPullRequestRepository();
  const pullRequests = pullRequestsProjector(eventStore, pullRequestRepository);
  pullRequests.start();

  //--Automation
  const allowPullRequestMergingTaskExecutor = new InMemoryAllowPullRequestMergingTaskExecutor(allowPullRequestMerging);
  const allowPullRequestMergingWhenOpened = allowPullRequestMergingWhenOpenedAutomation(eventStore, allowPullRequestMergingTaskExecutor);
  allowPullRequestMergingWhenOpened.start();

  //-Presentation Layer (REST API)
  server.use('/rest-api', openPullRequestRestApi(openPullRequest, idGenerator));
  server.use('/rest-api', mergePullRequestRestApi(mergePullRequest));
  server.use('/rest-api', allowPullRequestMergingRestApi(allowPullRequestMerging));
  server.use('/rest-api', disallowPullRequestMergingRestApi(disallowPullRequestMerging));
  server.use('/rest-api', pullRequestsRestApi(pullRequestRepository));

  server.use(process.env.API_DOCS_ENDPOINT_URL || '/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  process.on('exit', async function () {
    await allowPullRequestMergingWhenOpened.stop();
    await pullRequests.stop();
  });
  return { restApi: server };
}
