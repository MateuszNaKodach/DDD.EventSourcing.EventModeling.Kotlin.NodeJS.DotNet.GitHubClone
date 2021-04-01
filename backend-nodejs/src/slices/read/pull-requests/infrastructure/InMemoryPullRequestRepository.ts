import { PullRequest } from '../application/PullRequestsProjector';
import { PullRequestRepository } from '../application/PullRequestRepository';

//In memory state of the projection. Could be database repository / cache etc.
export class InMemoryPullRequestRepository implements PullRequestRepository {
  readonly entries: { [pullRequestId: string]: PullRequest } = {};

  async findAll(): Promise<PullRequest[]> {
    return Object.values(this.entries);
  }

  async findById(pullRequestId: PullRequest['pullRequestId']): Promise<PullRequest | undefined> {
    return this.entries[pullRequestId];
  }

  async save(pullRequest: PullRequest): Promise<void> {
    this.entries[pullRequest.pullRequestId] = pullRequest;
  }

  findAllByRepositoryId(repositoryId: string): Promise<PullRequest[]> {
    const result = Object.values(this.entries).filter((pullRequest) => pullRequest.repositoryId === repositoryId);
    return Promise.resolve(result);
  }
}
