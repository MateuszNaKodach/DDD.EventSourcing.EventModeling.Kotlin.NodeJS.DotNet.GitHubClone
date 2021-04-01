import express, { Request, Response } from 'express';
import { OpenPullRequest, OpenPullRequestApplicationService } from '../application/OpenPullRequestApplicationService';
import { RepositoryId } from '../../../../shared/domain/RepositoryId';
import { EntityIdGenerator } from '../../../../shared/application/EntityIdGenerator';
import { PostOpenPullRequestRequestBody } from './PostOpenPullRequestRequestBody';

export function openPullRequestRestApi(
  applicationService: OpenPullRequestApplicationService,
  idGenerator: EntityIdGenerator,
): express.Router {
  const postOpenPullRequest = async (request: Request, response: Response) => {
    const requestBody: PostOpenPullRequestRequestBody = request.body;
    const owner: string = request.params.owner;
    const repository: string = request.params.repository;

    const pullRequestId = idGenerator.generate();
    const repositoryId = new RepositoryId(owner, repository).toString();
    const command: OpenPullRequest = {
      repositoryId: repositoryId,
      pullRequestId: pullRequestId,
      title: requestBody.title,
      sourceBranch: requestBody.sourceBranch,
      targetBranch: requestBody.targetBranch,
      author: requestBody.author,
    };

    return applicationService
      .execute(command)
      .then(() => response.status(200).send({ message: 'Pull request was opened', pullRequestId, repositoryId }))
      .catch((error) => response.status(400).send({ message: error.message }));
  };

  return express.Router().post('/:owner/:repository/pulls', postOpenPullRequest);
}
