import {CommentDto} from "../../restapi/PullRequestsApi";
import {Avatar, Flex, PointerBox, Text, Timeline} from "@primer/components";
import React from "react";

export const PullRequestComments = (props: { comments: CommentDto[] }) => {

  return (
      <Timeline>
        {
          props.comments
              .sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime())
              .map(
                  comment => (
                      <Timeline.Item>
                        <Timeline.Badge size={48}>
                          <Avatar src="https://avatars.githubusercontent.com/github" size={48} />
                        </Timeline.Badge>
                        <Timeline.Body>
                          <Comment {...comment} />
                        </Timeline.Body>
                      </Timeline.Item>
                  )
              )
        }
      </Timeline>
  )
}
export const Comment = (comment: CommentDto) => (
    <PointerBox p='1rem' caret='left-top' margin={0} marginLeft='1rem' flexGrow={1}>
      <Flex flexDirection='column'>
        <Text>{comment.author} commented at {new Date(comment.postedAt).toLocaleDateString()} {new Date(comment.postedAt).toLocaleTimeString()}</Text>
        <Text>{comment.text}</Text>
      </Flex>
    </PointerBox>
)
