import express, { Request, Response } from 'express';
import { RepositoryId } from '../../../../shared/domain/RepositoryId';
import { PullRequestRepository } from '../application/PullRequestRepository';

export function pullRequestsRestApi(pullRequestRepository: PullRequestRepository): express.Router {
  const getPullRequests = async (request: Request, response: Response) => {
    const owner: string = request.params.owner;
    const repository: string = request.params.repository;

    const repositoryId = new RepositoryId(owner, repository);
    return pullRequestRepository
      .findAllByRepositoryId(repositoryId.toString())
      .then((pullRequests) => response.status(200).send({ pullRequests }))
      .catch((error) => response.status(400).send({ message: error.message }));
  };

  return express.Router().get('/:owner/:repository/pulls', getPullRequests);
}
