import axios, {AxiosResponse} from "axios";
import {delay} from "../fakes/delay";

export type PullRequestDto = {
  repositoryId: string;
  pullRequestId: string;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'notReadyToMerge' | 'readyToMerge' | 'merged';
  author: string;
}

export type PullRequestListDto = {
  readonly pullRequests: PullRequestDto[]
}

export type CommentDto = {
  readonly pullRequestId: string;
  readonly commentId: string;
  readonly postedAt: Date;
  readonly author: string;
  readonly text: string;
}

export type CommentListDto = {
  readonly comments: CommentDto[]
}

export type PostOpenPullRequestRequestBody = {
  readonly title: string;
  readonly sourceBranch: string;
  readonly targetBranch: string;
  readonly author: string
}

//Not efficient implementation just for Workshop purpose
export const PullRequestApi = () => {
  return {
    postOpenPullRequest(pullRequest: { owner: string, repository: string } & PostOpenPullRequestRequestBody): Promise<{ pullRequestId: string }> {
      const baseUrl = process.env.REACT_APP_POST_OPEN_PULL_REQUEST_SLICE_URL;
      return axios.post<PostOpenPullRequestRequestBody, AxiosResponse<{ pullRequestId: string }>>(
          `${baseUrl}/${pullRequest.owner}/${pullRequest.repository}/pulls`,
          {...pullRequest}
      )
          .then(response => response.data)
    },
    postMergePullRequest(pullRequest: { owner: string, repository: string, pullRequestId: string }): Promise<void> {
      const baseUrl = process.env.REACT_APP_POST_MERGE_PULL_REQUEST_SLICE_URL;
      return axios.post(
          `${baseUrl}/${pullRequest.owner}/${pullRequest.repository}/pulls/${pullRequest.pullRequestId}/merge`,
          {mergedBy: "FakeLoggedUser"}
      )
          .then(response => response.data)
    },
    getPullRequestsBy(query: { owner: string, repository: string }): Promise<PullRequestListDto> {
      const baseUlr = process.env.REACT_APP_GET_PULL_REQUESTS_SLICE_URL;
      return axios.get<PullRequestListDto>(`${baseUlr}/${query.owner}/${query.repository}/pulls`)
          .then(response => response.data)
    },
    getPullRequestsCountBy(query: { owner: string, repository: string }): Promise<number> {
      const baseUlr = process.env.REACT_APP_GET_PULL_REQUESTS_SLICE_URL;
      return axios.get<PullRequestListDto>(`${baseUlr}/${query.owner}/${query.repository}/pulls`)
          .then(response => response.data.pullRequests.length)
    },
    async getPullRequestBy(query: { owner: string, repository: string, pullRequestId: string }): Promise<PullRequestDto | undefined> {
      const baseUlr = process.env.REACT_APP_GET_PULL_REQUESTS_SLICE_URL;
      await delay(4000)
      return axios.get<PullRequestListDto>(`${baseUlr}/${query.owner}/${query.repository}/pulls`)
          .then(response => response.data.pullRequests.find(pr => pr.pullRequestId === query.pullRequestId))
    },
    async getCommentsBy(query: { owner: string, repository: string, pullRequestId: string }): Promise<CommentListDto> {
      const baseUlr = process.env.REACT_APP_GET_COMMENTS_SLICE_URL;
      await delay(2000)
      return axios.get<CommentListDto>(`${baseUlr}/${query.owner}/${query.repository}/pulls/${query.pullRequestId}/comments`)
          .then(response => response.data)
    },
    getCommentsCountBy(query: { owner: string, repository: string, pullRequestId: string }): Promise<number> {
      const baseUlr = process.env.REACT_APP_GET_COMMENTS_SLICE_URL;
      return axios.get<CommentListDto>(`${baseUlr}/${query.owner}/${query.repository}/pulls/${query.pullRequestId}/comments`)
          .then(response => response.data.comments.length)
    },
    postComment(comment: { owner: string, repository: string, pullRequestId: string, text: string, author: string }): Promise<void> {
      const baseUrl = process.env.REACT_APP_POST_COMMENT_SLICE_URL;
      return axios.post(
          `${baseUrl}/${comment.owner}/${comment.repository}/pulls/${comment.pullRequestId}/comments`,
          {text: comment.text, author: comment.author}
      ).then();
    },
    async postConfigurePullRequestRequiredApproves(settings: { owner: string, repository: string, branch: string, requiredApprovingReviews: number }): Promise<void> {
      const baseUrl = process.env.REACT_APP_POST_BRANCH_REQUIRED_APPROVES_URL;
      await delay(2000);
      return axios.post(
          `${baseUrl}/${settings.owner}/${settings.repository}/settings/branch-protection-rules/required-approves`,
          {branch: settings.branch, requiredApprovingReviews: settings.requiredApprovingReviews}
      ).then()
    },
    getRepositoryRequiredApproves(query: { owner: string, repository: string }): Promise<{ branch: string, requiredApprovingReviews: number }[]> {
      const baseUrl = process.env.REACT_APP_GET_REQUIRED_APPROVES_URL;
      return axios.get<{ branch: string, requiredApprovingReviews: number }[]>(
          `${baseUrl}/${query.owner}/${query.repository}/settings/branch-protection-rules/required-approves`
      ).then(response => response.data)
    },
    getBranchRequiredApproves(query: { owner: string, repository: string, branch: string }): Promise<number> {
      return this.getRepositoryRequiredApproves(query)
          .then(settings => settings.find(branchSettings => branchSettings.branch === query.branch)?.requiredApprovingReviews)
          .then(requiredApproves => requiredApproves ?? 0)
    },
    async postApprovePullRequest(approve: { owner: string, repository: string, pullRequestId: string, comment: string, reviewer: string }): Promise<void> {
      const baseUrl = process.env.REACT_APP_APPROVE_PULL_REQUEST_URL;
      await delay(2000);
      return axios.post(
          `${baseUrl}/${approve.owner}/${approve.repository}/${approve.pullRequestId}/reviews/approves`,
          {comment: approve.comment, reviewer: approve.reviewer}
      ).then();
    },
  }
}
