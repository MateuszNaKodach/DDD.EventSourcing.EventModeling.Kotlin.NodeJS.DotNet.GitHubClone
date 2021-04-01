import {Box, BranchName, ButtonPrimary, Flex, Heading, StateLabel, TabNav, Text} from "@primer/components";
import React from "react";
import {useAsyncFn, useAsyncRetry} from "react-use";
import {PullRequestApi, PullRequestDto} from "../../restapi/PullRequestsApi";
import {Merging} from "./Merging";
import {LeaveComment} from "./LeaveComment";
import {PullRequestComments} from "./PullRequestComments";

export type PullRequestDetailsProps = {
  readonly owner: string;
  readonly repository: string;
  readonly pullRequestId: string;
}

export const PullRequestDetails = (props: PullRequestDetailsProps) => {
  const getDetails = useAsyncRetry(
      () => PullRequestApi().getPullRequestBy({owner: props.owner, repository: props.repository, pullRequestId: props.pullRequestId}),
      [props.owner, props.repository, props.pullRequestId]
  )

  const getComments = useAsyncRetry(() => PullRequestApi().getCommentsBy({owner: props.owner, repository: props.repository, pullRequestId: props.pullRequestId}),
      [props.owner, props.repository, props.pullRequestId]
  );

  if (getDetails.value == undefined || getDetails.loading) {
    return <div>Loading...</div>
  }

  function renderComments() {
    if (getComments.value == undefined) {
      return <div>Loading comments...</div>
    }
    const commentsList = getComments.value;
    return <PullRequestComments comments={commentsList.comments} />;
  }

  const details = getDetails.value;

  function renderMerging() {
    if (details.status === "merged") {
      return null;
    }
    return <Merging {...{...props, details}} onMerged={() => getDetails.retry()} />;
  }

  function renderApproving() {
    if (details.status === "merged") {
      return null;
    }
    return <ApprovingPullRequest {...{...props, ...details}} onApproved={() => getDetails.retry()} />;
  }

  return (
      <>
        <Flex>
          <Heading>{details.title}</Heading>
          <Heading marginLeft='1rem' color='grey'>#{details.pullRequestId}</Heading>
        </Flex>
        <Text>
          <StateLabel status={details.status === "merged" ? "pullMerged" : "pullOpened"}>{details.status === "merged" ? "Merged" : "Open"}</StateLabel> {details.author} wants to merge
          into <BranchName>{details.targetBranch}</BranchName> from <BranchName>{details.sourceBranch}</BranchName>
        </Text>
        <TabNav aria-label="Main" marginTop='2rem'>
          <TabNav.Link href="#home" selected>
            Conversation
          </TabNav.Link>
          <TabNav.Link>Commits (Not Implemented)</TabNav.Link>
          <TabNav.Link>Files Changed (Not Implemented)</TabNav.Link>
        </TabNav>
        <Box maxWidth='60vw'>
          {renderComments()}
          {renderMerging()}
          {renderApproving()}
          <LeaveComment owner={props.owner} repository={props.owner} pullRequestId={details.pullRequestId} onCommentAdded={() => getComments.retry()} />
        </Box>
      </>
  )
}


export const ApprovingPullRequest = (props: PullRequestDto & PullRequestDetailsProps & { onApproved: () => any }) => {
  const [postApproveState, postApprove] = useAsyncFn(() => {
    const randomReviewer = new Date().toISOString()
    return PullRequestApi().postApprovePullRequest(
        {owner: props.owner, repository: props.repository, pullRequestId: props.pullRequestId, comment: "Pull request accepted", reviewer: randomReviewer}
    )
  });

  function onApproveClick() {
    postApprove()
        .then(props.onApproved())
  }

  return (
      <Box alignSelf='flex-end' marginTop='1rem'>
        <ButtonPrimary disabled={postApproveState.loading} onClick={onApproveClick}>
          Approve by random user
        </ButtonPrimary>
      </Box>
  )
}
