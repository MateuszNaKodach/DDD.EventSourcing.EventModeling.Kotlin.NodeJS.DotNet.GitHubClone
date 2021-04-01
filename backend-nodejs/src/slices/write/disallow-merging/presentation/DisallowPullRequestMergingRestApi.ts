import express, { Request, Response } from 'express';
import { RepositoryId } from '../../../../shared/domain/RepositoryId';
import {
  DisallowPullRequestMerging,
  DisallowPullRequestMergingApplicationService,
} from '../application/DisallowPullRequestMergingApplicationService';

export function disallowPullRequestMergingRestApi(applicationService: DisallowPullRequestMergingApplicationService): express.Router {
  const postDisallowPullRequestMerging = async (request: Request, response: Response) => {
    const owner: string = request.params.owner;
    const repository: string = request.params.repository;
    const pullRequestId: string = request.params.pullRequestId;

    const command: DisallowPullRequestMerging = {
      repositoryId: new RepositoryId(owner, repository).toString(),
      pullRequestId: pullRequestId,
    };

    return applicationService
      .execute(command)
      .then(() => response.status(200).send({ message: 'Pull request merging was disallowed!' }))
      .catch((error) => response.status(400).send({ message: error.message }));
  };

  return express.Router().post('/:owner/:repository/pulls/:pullRequestId/disallow-merging', postDisallowPullRequestMerging);
}
