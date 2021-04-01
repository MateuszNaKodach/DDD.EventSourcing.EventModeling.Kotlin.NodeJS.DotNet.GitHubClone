import {useRouteMatch} from "react-router-dom";
import React from "react";
import {PullRequestsList} from "./PullRequestsList";
import {useAsync} from "react-use";
import {PullRequestApi} from "../../restapi/PullRequestsApi";
import {Flash} from "@primer/components";

export type PullRequestsListRouteParams = {
  readonly owner: string;
  readonly repository: string;
}

export const PullRequestsListRoute = () => {
  const match = useRouteMatch<PullRequestsListRouteParams>("/:owner/:repository/pulls");
  const owner = match?.params.owner!;
  const repository = match?.params.repository!;
  const state = useAsync(async () => {
    return await PullRequestApi().getPullRequestsBy({owner, repository})
  }, [owner, repository]);
  if (!owner || !repository || !state || !state.value) {
    return <Flash variant="danger">Error while loading... Backend is probably off or not implemented.</Flash>;
  }
  return <PullRequestsList owner={owner} repository={repository} pullRequests={state.value.pullRequests} />
}
