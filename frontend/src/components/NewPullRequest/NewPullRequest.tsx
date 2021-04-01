import React, {useState} from "react";
import {Avatar, BorderBox, Box, Button, ButtonPrimary, Flash, Flex, Heading, Pagehead, PointerBox, SelectMenu, StyledOcticon, Text, TextInput} from "@primer/components";
import {ArrowLeftIcon, GitPullRequestIcon, TriangleDownIcon} from "@primer/octicons-react";
import {generatePath, NavLink, useHistory} from "react-router-dom";
import {BRANCHES} from "../../fakes/branches";
import {PullRequestApi} from "../../restapi/PullRequestsApi";


export type NewPullRequestProps = {
  readonly owner: string;
  readonly repository: string;
  readonly targetBranch: string;
  readonly sourceBranch: string;
}

export const NewPullRequest = (props: NewPullRequestProps) => {
  return (
      <>
        <Pagehead>
          <Heading fontSize={4}>Open a pull request</Heading>
          <Text marginTop={0}>Create a new pull request by comparing changes across two branches.</Text>
        </Pagehead>
        <BorderBox backgroundColor='#F6F8FA' padding='1rem'>
          <Flex alignItems='center'>
            <StyledOcticon mr={2} size={18} icon={GitPullRequestIcon} marginRight='1rem' />
            <SelectMenu>
              <Button as="summary">base: {props.targetBranch}<StyledOcticon mr={2} size={18} icon={TriangleDownIcon} marginRight={0} /></Button>
              <SelectMenu.Modal>
                <SelectMenu.Header>Choose base ref</SelectMenu.Header>
                <SelectMenu.List>
                  {
                    BRANCHES.map(branch =>
                        <NavLink to={generatePath("/:owner/:repository/compare/:targetAndSourceBranches", {
                          owner: props.owner,
                          repository: props.repository,
                          targetAndSourceBranches: `${branch}...${props.sourceBranch}`
                        })}>
                          <SelectMenu.Item>
                            {branch}
                          </SelectMenu.Item>
                        </NavLink>)
                  }
                </SelectMenu.List>
              </SelectMenu.Modal>
            </SelectMenu>
            <StyledOcticon mr={2} size={18} icon={ArrowLeftIcon} marginLeft='1rem' marginRight='1rem' />
            <SelectMenu>
              <Button as="summary">compare: {props.sourceBranch}<StyledOcticon mr={2} size={18} icon={TriangleDownIcon} marginRight={0} /></Button>
              <SelectMenu.Modal>
                <SelectMenu.Header>Choose a head ref</SelectMenu.Header>
                <SelectMenu.List>
                  {
                    BRANCHES.map(branch =>
                        <NavLink to={generatePath("/:owner/:repository/compare/:targetAndSourceBranches", {
                          owner: props.owner,
                          repository: props.repository,
                          targetAndSourceBranches: `${props.targetBranch}...${branch}`
                        })}>
                          <SelectMenu.Item>
                            {branch}
                          </SelectMenu.Item>
                        </NavLink>)
                  }
                </SelectMenu.List>
              </SelectMenu.Modal>
            </SelectMenu>
          </Flex>
        </BorderBox>
        {(props.sourceBranch === props.targetBranch) ? <ChooseDifferentBranchesWarning /> : <PullRequestDetailsBox {...props} />}
      </>
  )
}

const ChooseDifferentBranchesWarning = () => (
    <Flash variant="warning" marginTop='2rem'>Choose different branches or forks above to discuss and review changes.</Flash>
)

const PullRequestDetailsBox = (props: NewPullRequestProps) => {
  const [title, setTitle] = useState<string | undefined>(undefined)
  const history = useHistory()

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function onCreatePullRequestClicked() {
    if (title) {
      PullRequestApi().postOpenPullRequest({owner: props.owner, repository: props.repository, author: "FakeLoggedUser", title, targetBranch: props.targetBranch, sourceBranch: props.sourceBranch})
          .then(response => history.replace(`/${props.owner}/${props.repository}/pull/${response.pullRequestId}`));
    }
  }

  return (
      <Flex flexDirection='row' justifyContent='flex-start' marginTop='2rem'>
        <Avatar src="https://avatars.githubusercontent.com/github" size={48} />
        <PointerBox p='1rem' caret='left-top' margin={0} marginLeft='1rem' flexGrow={1}>
          <Flex flexDirection='column'>
            <TextInput aria-label="PullRequestTitle" name="title" placeholder="Title" variant='large' backgroundColor='#F6F8FA' value={title} onChange={event => handleTitleChange(event)} />
            <Box alignSelf='flex-end' marginTop='1rem'>
              <ButtonPrimary disabled={title === undefined || title === ''} onClick={onCreatePullRequestClicked}>
                Create pull request
              </ButtonPrimary>
            </Box>
          </Flex>
        </PointerBox>
      </Flex>
  )
}
