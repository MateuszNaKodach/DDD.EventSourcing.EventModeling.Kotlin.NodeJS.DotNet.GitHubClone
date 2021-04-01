import {Box, Breadcrumb, CounterLabel, Flex, Heading, StyledOcticon, Text, UnderlineNav} from "@primer/components";
import {generatePath, NavLink, Route, Switch, useRouteMatch} from "react-router-dom";
import {PullRequestsList} from "../PullRequestsList/PullRequestsList";
import {NewPullRequestRoute} from "../NewPullRequest/NewPullRequestRoute";
import React from "react";
import {GearIcon, GitPullRequestIcon, RepoIcon} from "@primer/octicons-react";
import {RepositorySettingsRoute} from "../RepositorySettings/RepositorySettings";
import {PullRequestDetails} from "../PullRequestDetails/PullRequestDetails";
import {PullRequestDetailsRoute} from "../PullRequestDetails/PullRequestDetailsRoute";
import {PullRequestsListRoute} from "../PullRequestsList/PullRequestsListRoute";

export interface RepositoryRouteParams {
  readonly owner: string;
  readonly repository: string;
}

export const RepositoryRoute = () => {
  const match = useRouteMatch<RepositoryRouteParams>('/:owner/:repository');
  const owner = match?.params.owner;
  const repository = match?.params.repository;
  if (!owner || !repository) {
    return null;
  }
  return <Repository owner={owner} repository={repository} />
}

export interface RepositoryProps {
  readonly owner: string;
  readonly repository: string;
}

export const Repository = (props: RepositoryProps) => (
    <>
      <Box m={4}>
        <RepositoryBreadcrumbs owner={props.owner} repository={props.repository} />
      </Box>
      <RepositoryMenu {...props} />
      <Flex flexDirection='column' alignItems={'center'} justifyContent={'center'}>
        <Box m={4} maxWidth={'80vw'} minWidth={'80vw'} alignContent={'center'}>
          <Switch>
            <Route path='/:owner/:repository/pulls'>
              <PullRequestsListRoute />
            </Route>
            <Route path='/:owner/:repository/pull/:pullRequestId'>
              <PullRequestDetailsRoute />
            </Route>
            <Route path='/:owner/:repository/settings'>
              <RepositorySettingsRoute />
            </Route>
            <Route path='/:owner/:repository/compare/:targetAndSourceBranches'>
              <NewPullRequestRoute />
            </Route>
          </Switch>
        </Box>
      </Flex>
    </>
)

export const RepositoryBreadcrumbs = (props: { owner: string, repository: string }) => (
    <Flex alignItems='center'>
      <StyledOcticon mr={2} size={16} icon={RepoIcon} />
      <Breadcrumb>
        <Breadcrumb.Item><Heading fontSize={4}>{props.owner}</Heading></Breadcrumb.Item>
        <Breadcrumb.Item><Heading fontSize={4} fontWeight={700}>{props.repository}</Heading></Breadcrumb.Item>
      </Breadcrumb>
    </Flex>
)

export const RepositoryMenu = (props: RepositoryProps) => (
    <UnderlineNav aria-label="Main" paddingLeft='10vw' paddingRight='10vw'>
      <UnderlineNav.Link as={NavLink} to={generatePath("/:owner/:repository/pulls", {owner: props.owner, repository: props.repository})}>
        <StyledOcticon mr={2} size={16} icon={GitPullRequestIcon} />
        <Text fontWeight='600'>Pull Requests </Text>
        {/*<CounterLabel>X</CounterLabel>*/}
      </UnderlineNav.Link>
      <UnderlineNav.Link as={NavLink} to={generatePath("/:owner/:repository/settings", {owner: props.owner, repository: props.repository})}>
        <StyledOcticon mr={2} size={16} icon={GearIcon} />
        <Text>Settings</Text>
      </UnderlineNav.Link>
      {/*<UnderlineNav.Link href="#support">Event Modeling</UnderlineNav.Link>*/}
    </UnderlineNav>
)
