import {BorderBox, Box, BranchName, ButtonOutline, Flash, Flex, Heading, Pagehead, SideNav, Text, TextInput} from "@primer/components";
import React, {useState} from "react";
import {BRANCHES} from "../../fakes/branches";
import {useRouteMatch} from "react-router-dom";
import {useAsync, useAsyncFn} from "react-use";
import {PullRequestApi} from "../../restapi/PullRequestsApi";
import {useFormik} from "formik";
import {CommentFormValues} from "../PullRequestDetails/LeaveComment";

export interface RepositorySettingsRouteParams {
  readonly owner: string;
  readonly repository: string;
}

export const RepositorySettingsRoute = () => {
  const match = useRouteMatch<RepositorySettingsRouteParams>("/:owner/:repository/settings");
  const owner = match?.params.owner;
  const repository = match?.params.repository;
  if (!owner || !repository) {
    return null;
  }
  return <RepositorySettings owner={owner} repository={repository} />
}

export type RepositorySettingsProps = {
  readonly owner: string;
  readonly repository: string;
}

export const RepositorySettings = (props: RepositorySettingsProps) => (
    <Flex>
      <SideNav bordered aria-label="Main" flexGrow={3} minWidth='20vw'>
        <SideNav.Link>
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link selected>
          <Text>Branches</Text>
        </SideNav.Link>
        <SideNav.Link href="#emails">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
        <SideNav.Link href="#notifications">
          <Text>Not Implemented</Text>
        </SideNav.Link>
      </SideNav>
      <BranchesSettings {...props} />
    </Flex>
)
export const BranchesSettings = (props: RepositorySettingsProps) => {
  const state = useAsync(async () => {
    const branchSettings = await PullRequestApi().getRepositoryRequiredApproves({owner: props.owner, repository: props.repository})
    return BRANCHES.map(branchName => branchSettings.find(settings => settings.branch === branchName) ?? {branch: branchName, requiredApprovingReviews: 0})
  }, [props.owner, props.repository]);

  function renderBranchesSettingsList() {
    if (!state.value) {
      return <Flash variant="danger">Error while loading... Backend is probably off or not implemented.</Flash>;
    }
    return <BranchSettingsList branches={state.value.map(branchSettings => ({...props, branch: branchSettings.branch, requiredApprovingReviews: branchSettings.requiredApprovingReviews}))} />;
  }

  return (
      <Box paddingLeft='2rem'>
        <Pagehead>
          <Heading fontSize={4}>Branch protection rules</Heading>
        </Pagehead>
        <Text>Define branch protection rules to disable force pushing, prevent branches from being deleted, and optionally require status checks before merging. New to branch protection rules?</Text>
        {renderBranchesSettingsList()}
      </Box>
  )
}

export type BranchSettingsListItemProps = {
  readonly owner: string
  readonly repository: string
  readonly branch: string
  readonly requiredApprovingReviews: number
}
export type BranchSettingsListProps = { branches: BranchSettingsListItemProps[] }
export const BranchSettingsList = (props: BranchSettingsListProps) => {
  return (
      <>
        <BorderBox marginTop='2rem'>
          <SideNav aria-label="Main">
            {props.branches.map(branch => <BranchSettingsListItem {...branch} />)}
          </SideNav>
        </BorderBox>
      </>
  )
}

export const BranchSettingsListItem = (props: BranchSettingsListItemProps) => {
  const [initialRequiredApproves, setInitialRequiredApproves] = useState(props.requiredApprovingReviews);
  const [postRequiredApprovesState, postRequiredApproves] = useAsyncFn((request: {requiredApproves: number}) => PullRequestApi()
          .postConfigurePullRequestRequiredApproves({owner: props.owner, repository: props.repository, branch: props.branch, requiredApprovingReviews: request.requiredApproves}),
      [props.owner, props.repository]);

  const formik = useFormik<{requiredApproves: number}>({
    initialValues: {
      requiredApproves: props.requiredApprovingReviews,
    },
    onSubmit: async (values, {resetForm}) => {
      await postRequiredApproves({requiredApproves: values.requiredApproves})
          .then(() => setInitialRequiredApproves(values.requiredApproves))
    },
  });

  return (
      <SideNav.Link variant='full' backgroundColor='white'>
        <BranchName>{props.branch}</BranchName>
        <form onSubmit={formik.handleSubmit}>
          <Text>Required approves: </Text>
          <TextInput marginLeft='1rem' aria-label="requiredApproves" id="requiredApproves" name="requiredApproves" backgroundColor='#F6F8FA' value={formik.values.requiredApproves}
                     type="number" onChange={formik.handleChange}/>
          <ButtonOutline marginLeft='1rem' disabled={formik.values.requiredApproves === initialRequiredApproves || postRequiredApprovesState.loading} type='submit'>Apply</ButtonOutline>
        </form>
      </SideNav.Link>
  )
}
