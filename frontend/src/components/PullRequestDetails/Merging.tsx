import {RepositoryProps} from "../Repository/Repository";
import {useAsync, useAsyncFn} from "react-use";
import {PullRequestApi, PullRequestDto} from "../../restapi/PullRequestsApi";
import {BorderBox, Box, ButtonPrimary, CircleOcticon, Flash, Flex, Heading, PointerBox, StyledOcticon, Text} from "@primer/components";
import {CheckIcon, GitMergeIcon, XIcon} from "@primer/octicons-react";
import React from "react";
import {PullRequestDetailsProps} from "./PullRequestDetails";

export const Merging = (props: PullRequestDetailsProps & {details: PullRequestDto, onMerged: () => any}) => {
  const requiredApproves = useAsync(async () => {
    return await PullRequestApi().getBranchRequiredApproves({owner: props.owner, repository: props.repository, branch: props.details.targetBranch})
  }, [props.owner, props.repository, props.pullRequestId]);

  const [postMergeResponse, postMerge] = useAsyncFn(() => PullRequestApi().postMergePullRequest({owner: props.owner, repository: props.repository, pullRequestId: props.pullRequestId}));

  if (requiredApproves.value === undefined) {
    console.log(requiredApproves)
    return <Flash variant="danger">Error while loading... Backend is probably off or not implemented.</Flash>;
  }

  function mergingInfoFlex() {
    if (props.details.status === "notReadyToMerge") {
      return (
          <Flex>
            <CircleOcticon icon={XIcon} size={32} bg="icon.danger" color="text.inverse" />
            <Box marginLeft='1rem'>
              <Heading fontSize={3}>Merging is blocked</Heading>
              <Text>At least {requiredApproves.value} approving reviews are required by reviewers with write access.</Text>
            </Box>
          </Flex>
      )
    }
    return (
        <Flex>
          <CircleOcticon icon={CheckIcon} size={32} bg="icon.success" color="text.inverse" />
          <Box marginLeft='1rem'>
            <Heading fontSize={3}>Merging is allowed</Heading>
          </Box>
        </Flex>
    )
  }

  function handleOnMergeClicked() {
    postMerge().then(() => props.onMerged())
  }

  return (
      <Flex flexDirection='row' justifyContent='flex-start' marginTop='2rem'>
        <BorderBox width={48} height={48} backgroundColor='black'>
          <Flex width={48} height={48} justifyContent='center' alignItems='center'>
            <StyledOcticon mr={2} size={36} icon={GitMergeIcon} color="text.inverse" margin={0} />
          </Flex>
        </BorderBox>
        <PointerBox p='1rem' caret='left-top' margin={0} marginLeft='1rem' flexGrow={1}>
          <Flex flexDirection='column'>
            {mergingInfoFlex()}
            <Box alignSelf='flex-start' marginTop='1rem'>
              <ButtonPrimary disabled={props.details.status === "notReadyToMerge" || postMergeResponse.loading} onClick={handleOnMergeClicked}>
                Merge
              </ButtonPrimary>
            </Box>
          </Flex>
        </PointerBox>
      </Flex>
  )
}
