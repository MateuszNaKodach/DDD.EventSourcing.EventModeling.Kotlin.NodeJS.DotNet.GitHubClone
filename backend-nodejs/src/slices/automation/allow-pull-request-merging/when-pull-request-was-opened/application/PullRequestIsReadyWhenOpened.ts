import { EventStoreDBClient, JSONEventType, ReadableSubscription } from '@eventstore/db-client';
import { Projection } from '../../../../../shared/application/Projection';
import { AllowPullRequestMerging, AllowPullRequestMergingTaskExecutor } from './AllowPullRequestMergingTaskExecutor';

type AllowPullRequestMergingTasks = { [taskId: string]: AllowPullRequestMerging };

type PullRequestWasOpened = JSONEventType<
  'PullRequestWasOpened',
  { repositoryId: string; pullRequestId: string; title: string; sourceBranch: string; targetBranch: string; author: string }
>;

type PullRequestMergingWasAllowed = JSONEventType<'PullRequestMergingWasAllowed', { repositoryId: string; pullRequestId: string }>;

export function allowPullRequestMergingWhenOpenedAutomation(
  eventStore: EventStoreDBClient,
  taskExecutor: AllowPullRequestMergingTaskExecutor,
): Projection {
  const todoList: AllowPullRequestMergingTasks = {};
  const subscriptions: ReadableSubscription<any>[] = [];

  async function scheduleTask(task: AllowPullRequestMerging, onTaskScheduled: (task: AllowPullRequestMerging) => Promise<void>) {
    todoList[task.pullRequestId] = task;
    await onTaskScheduled(task);
  }

  function taskWasDone(taskId: string) {
    delete todoList[taskId];
  }

  function start() {
    const wasOpenedSubscription = eventStore
      .subscribeToStream<PullRequestWasOpened>('$et-PullRequestWasOpened', { fromRevision: 'start', resolveLinkTos: true })
      .on('data', async ({ event }) => {
        if (event) {
          await scheduleTask({ repositoryId: event.data.repositoryId, pullRequestId: event.data.pullRequestId }, async (task) => {
            await taskExecutor.execute(task);
          });
        }
      });

    const mergingWasAllowedSubscription = eventStore
      .subscribeToStream<PullRequestMergingWasAllowed>('$et-PullRequestMergingWasAllowed', { fromRevision: 'start', resolveLinkTos: true })
      .on('data', async ({ event }) => {
        if (event) {
          taskWasDone(event.data.pullRequestId);
          console.log('AllowPullRequestMergingWhenOpenedAutomation handled event ' + event.type, event.data);
        }
      });

    subscriptions.push(wasOpenedSubscription, mergingWasAllowedSubscription);
    console.log('AllowPullRequestMergingWhenOpenedAutomation started.');
  }

  async function stop() {
    await Promise.all(subscriptions.map((sub) => sub.unsubscribe()));
    console.log('AllowPullRequestMergingWhenOpenedAutomation stopped.');
  }

  return { start, stop };
}
