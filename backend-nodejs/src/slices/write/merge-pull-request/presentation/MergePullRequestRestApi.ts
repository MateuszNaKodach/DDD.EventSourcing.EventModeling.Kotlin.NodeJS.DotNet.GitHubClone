import express, { Request, Response } from 'express';
import { RepositoryId } from '../../../../shared/domain/RepositoryId';
import { MergePullRequest, MergePullRequestApplicationService } from '../application/MergePullRequestApplicationService';

export type MergePullRequestRequestBody = {
  readonly mergedBy: string;
};

export function mergePullRequestRestApi(applicationService: MergePullRequestApplicationService): express.Router {
  const postMergePullRequest = async (request: Request, response: Response) => {
    const requestBody: MergePullRequestRequestBody = request.body;
    const owner: string = request.params.owner;
    const repository: string = request.params.repository;
    const pullRequestId: string = request.params.pullRequestId;

    const command: MergePullRequest = {
      repositoryId: new RepositoryId(owner, repository).toString(),
      pullRequestId: pullRequestId,
      mergedBy: requestBody.mergedBy,
    };

    return applicationService
      .execute(command)
      .then(() => response.status(200).send({ message: 'Pull request was merged' }))
      .catch((error) => response.status(400).send({ message: error.message }));
  };

  return express.Router().post('/:owner/:repository/pulls/:pullRequestId/merge', postMergePullRequest);
}
