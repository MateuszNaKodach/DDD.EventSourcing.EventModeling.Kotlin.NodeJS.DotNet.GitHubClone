import { PullRequest } from './PullRequestsProjector';

export interface PullRequestRepository {
  save(pullRequest: PullRequest): Promise<void>;

  findById(pullRequestId: PullRequest['pullRequestId']): Promise<PullRequest | undefined>;

  findAll(): Promise<PullRequest[]>;

  findAllByRepositoryId(repositoryId: string): Promise<PullRequest[]>;
}
