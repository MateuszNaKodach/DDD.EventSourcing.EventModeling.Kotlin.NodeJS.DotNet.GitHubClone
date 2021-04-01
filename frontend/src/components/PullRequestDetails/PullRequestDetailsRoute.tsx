import {useRouteMatch} from "react-router-dom";
import React from "react";
import {PullRequestDetails} from "./PullRequestDetails";
import {useAsync} from "react-use";
import {PullRequestApi} from "../../restapi/PullRequestsApi";


export type PullRequestDetailsRouteParams = {
  readonly owner: string;
  readonly repository: string;
  readonly pullRequestId: string;
}

export const PullRequestDetailsRoute = () => {
  const match = useRouteMatch<PullRequestDetailsRouteParams>("/:owner/:repository/pull/:pullRequestId");
  const owner = match?.params.owner!;
  const repository = match?.params.repository!;
  const pullRequestId = match?.params.pullRequestId!;
  // const response = useAsync(async () => {
  //   return await PullRequestApi().getPullRequestBy({owner, repository, pullRequestId})
  // }, [owner, repository, pullRequestId]);
  if (!owner || !repository || !pullRequestId) {
    return null;
  }
  return <PullRequestDetails pullRequestId={pullRequestId} repository={repository} owner={owner}/>
}

