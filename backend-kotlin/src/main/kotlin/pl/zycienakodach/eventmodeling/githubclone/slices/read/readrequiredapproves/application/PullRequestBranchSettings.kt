package pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application

data class PullRequestBranchSettings(val repositoryId: String, val branch: String, val requiredApprovingReviews: Int)
