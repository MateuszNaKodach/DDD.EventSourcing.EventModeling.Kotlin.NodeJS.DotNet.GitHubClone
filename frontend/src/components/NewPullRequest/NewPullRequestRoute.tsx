import {useRouteMatch} from "react-router-dom";
import React from "react";
import {NewPullRequest} from "./NewPullRequest";

export interface NewPullRequestRouteParams {
  readonly owner: string;
  readonly repository: string;
  readonly targetAndSourceBranches: string;
}

export const NewPullRequestRoute = () => {
  const match = useRouteMatch<NewPullRequestRouteParams>("/:owner/:repository/compare/:targetAndSourceBranches");
  const owner = match?.params.owner;
  const repository = match?.params.repository;
  const targetBranch = match?.params.targetAndSourceBranches.split('...')[0]
  const sourceBranch = match?.params.targetAndSourceBranches.split('...')[1]
  if (!owner || !repository || !targetBranch || !sourceBranch) {
    return null;
  }
  return <NewPullRequest owner={owner} repository={repository} targetBranch={targetBranch} sourceBranch={sourceBranch} />
}
