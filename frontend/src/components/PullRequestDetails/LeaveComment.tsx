import {RepositoryProps} from "../Repository/Repository";
import {useFormik} from "formik";
import {useAsyncFn} from "react-use";
import {PullRequestApi} from "../../restapi/PullRequestsApi";
import {Avatar, Box, ButtonPrimary, Flex, FormGroup, PointerBox, TextInput} from "@primer/components";
import React from "react";

export interface CommentFormValues {
  comment: string;
}

export const LeaveComment = (props: RepositoryProps & { pullRequestId: string, onCommentAdded: () => any }) => {
  const formik = useFormik<CommentFormValues>({
    initialValues: {
      comment: '',
    },
    onSubmit: async (values, {resetForm}) => {
      await postComment({comment: values.comment})
          .then(() => {
            props.onCommentAdded();
            resetForm();
          })
    },
  });

  const [postCommentState, postComment] = useAsyncFn(async (request: { comment: string }) => {
    await PullRequestApi().postComment({...props, text: request.comment, author: "FakeLoggedUser"});
  });

  return (
      <Flex flexDirection='row' justifyContent='flex-start' marginTop='2rem'>
        <Avatar src="https://avatars.githubusercontent.com/github" size={48} />
        <PointerBox p='1rem' caret='left-top' margin={0} marginLeft='1rem' flexGrow={1}>
          <form onSubmit={formik.handleSubmit} style={{width: '100%'}}>
            <Flex flexDirection='column'>
              <FormGroup style={{width: '100%'}}>
                <FormGroup.Label htmlFor="comment">Example text</FormGroup.Label>
                <TextInput width='100%' aria-label="CommentText" id="comment" name="comment" placeholder="Leave a comment" variant='large' backgroundColor='#F6F8FA' value={formik.values.comment || ''}
                           onChange={formik.handleChange} />
              </FormGroup>
              <Box alignSelf='flex-end' marginTop='1rem'>
                <ButtonPrimary disabled={postCommentState.loading || formik.values.comment === ''} type="submit">
                  Comment
                </ButtonPrimary>
              </Box>
            </Flex>
          </form>
        </PointerBox>
      </Flex>
  )
}
