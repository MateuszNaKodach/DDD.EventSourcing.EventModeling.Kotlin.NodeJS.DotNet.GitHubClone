import {BorderBox, ButtonPrimary, CounterLabel, Flex, Heading, SideNav, StyledOcticon, Text} from "@primer/components";
import {CheckIcon, CommentIcon, GitPullRequestIcon} from "@primer/octicons-react";
import React from "react";
import {generatePath, NavLink} from "react-router-dom";
import {RepositoryProps} from "../Repository/Repository";

export const PullRequestsTopBar = (props: RepositoryProps) => (
    <Flex justifyContent='flex-end' marginBottom='1rem'>
      <ButtonPrimary as={NavLink} to={
        generatePath("/:owner/:repository/compare/:targetAndSourceBranches", {owner: props.owner, repository: props.repository, targetAndSourceBranches: 'main...develop'})
      }>
        New pull request
      </ButtonPrimary>
    </Flex>
)
export type PullRequestsListProps = { pullRequests: PullRequestProps[] } & RepositoryProps

export type PullRequestProps = {
  readonly pullRequestId: string,
  readonly title: string,
  readonly status: "notReadyToMerge" | "readyToMerge" | "merged",
  readonly author: string,
}

export const PullRequestsList = (props: PullRequestsListProps) => {
  const opened = props.pullRequests.filter(pr => pr.status !== "merged").length
  const closed = props.pullRequests.filter(pr => pr.status === "merged").length

  function renderPullRequests() {
    if(props.pullRequests.length === 0 ){
      return <Flex justifyContent='center' alignItems='center' flexDirection='column' padding='4rem'>
        <StyledOcticon mr={2} size={36} icon={GitPullRequestIcon} color='grey' />
        <Heading fontSize={4}>There aren’t any pull requests.</Heading>
      </Flex>
    }
    return props.pullRequests.map(pullRequest => <PullRequestListItem repository={props.repository} owner={props.owner} {...pullRequest} />);
  }

  return (
      <>
        <PullRequestsTopBar {...props} />
        <BorderBox>
          <SideNav aria-label="Main">
            <SideNav.Link backgroundColor='#F6F8FA'>
              <Flex>
                <div>
                  <StyledOcticon mr={2} size={16} icon={GitPullRequestIcon} />
                  <Text fontWeight='600'>{opened} Open</Text>
                </div>
                <div style={{width: '1rem'}} />
                <div>
                  <StyledOcticon mr={2} size={16} icon={CheckIcon} />
                  <Text fontWeight='600'>{closed} Merged</Text>
                </div>
              </Flex>
            </SideNav.Link>
            {renderPullRequests()}
          </SideNav>
        </BorderBox>
      </>
  )

}
export const PullRequestListItem = (props: PullRequestProps & RepositoryProps) => (
    <SideNav.Link variant='full' backgroundColor='white' as={NavLink} to={
      generatePath("/:owner/:repository/pull/:pullRequestId", {owner: props.owner, repository: props.repository, pullRequestId: props.pullRequestId})
    }>
      <Flex flexDirection='column'>
        <div>
          <StyledOcticon mr={2} size={16} icon={GitPullRequestIcon} />
          <Text fontWeight='600' fontSize={2}>{props.title}</Text>
        </div>
        <Text>Created by {props.owner}. {props.status === 'merged' ? "Merged" : "Opened"}</Text>
      </Flex>
      {/*<div>*/}
      {/*  <StyledOcticon mr={2} size={16} icon={CommentIcon} />*/}
      {/*  <CounterLabel>16</CounterLabel>*/}
      {/*</div>*/}
    </SideNav.Link>
)
