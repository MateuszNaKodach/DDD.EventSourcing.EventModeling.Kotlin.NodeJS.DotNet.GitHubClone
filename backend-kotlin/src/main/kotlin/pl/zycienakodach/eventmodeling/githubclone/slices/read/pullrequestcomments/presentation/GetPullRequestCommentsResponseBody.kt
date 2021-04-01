package pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.presentation

import pl.zycienakodach.eventmodeling.githubclone.slices.read.pullrequestcomments.application.PullRequestComment

data class GetPullRequestCommentsResponseBody(val comments: List<PullRequestComment>)
