import { AllowPullRequestMerging, AllowPullRequestMergingTaskExecutor } from '../application/AllowPullRequestMergingTaskExecutor';
import { AllowPullRequestMergingApplicationService } from '../../../../write/allow-merging/application/AllowPullRequestMergingApplicationService';

export class InMemoryAllowPullRequestMergingTaskExecutor implements AllowPullRequestMergingTaskExecutor {
  constructor(private readonly allowPullRequestMergingApplicationService: AllowPullRequestMergingApplicationService) {}

  execute(task: AllowPullRequestMerging): Promise<void> {
    return this.allowPullRequestMergingApplicationService.execute({ repositoryId: task.repositoryId, pullRequestId: task.pullRequestId });
  }
}
