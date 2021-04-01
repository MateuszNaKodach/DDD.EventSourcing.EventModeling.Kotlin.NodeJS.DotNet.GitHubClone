export type AllowPullRequestMerging = { repositoryId: string; pullRequestId: string };

//Abstraction for task execution - may be sending command / REST API / RPC / internal method call
export interface AllowPullRequestMergingTaskExecutor {
  execute(task: AllowPullRequestMerging): Promise<void>;
}
