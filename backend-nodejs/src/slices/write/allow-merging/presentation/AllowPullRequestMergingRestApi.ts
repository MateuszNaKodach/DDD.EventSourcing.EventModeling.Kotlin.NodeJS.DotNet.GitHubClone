import express, { Request, Response } from 'express';
import { RepositoryId } from '../../../../shared/domain/RepositoryId';
import {
  AllowPullRequestMerging,
  AllowPullRequestMergingApplicationService,
} from '../application/AllowPullRequestMergingApplicationService';

export function allowPullRequestMergingRestApi(applicationService: AllowPullRequestMergingApplicationService): express.Router {
  const postAllowPullRequestMerging = async (request: Request, response: Response) => {
    const owner: string = request.params.owner;
    const repository: string = request.params.repository;
    const pullRequestId: string = request.params.pullRequestId;

    const command: AllowPullRequestMerging = {
      repositoryId: new RepositoryId(owner, repository).toString(),
      pullRequestId: pullRequestId,
    };

    return applicationService
      .execute(command)
      .then(() => response.status(200).send({ message: 'Pull request merging was allowed!' }))
      .catch((error) => response.status(400).send({ message: error.message }));
  };

  return express.Router().post('/:owner/:repository/pulls/:pullRequestId/allow-merging', postAllowPullRequestMerging);
}
