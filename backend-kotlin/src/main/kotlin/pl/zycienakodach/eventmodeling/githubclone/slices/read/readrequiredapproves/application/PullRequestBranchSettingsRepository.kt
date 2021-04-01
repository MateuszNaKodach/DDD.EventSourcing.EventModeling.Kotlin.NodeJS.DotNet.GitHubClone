package pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application

interface PullRequestBranchSettingsRepository {
    fun findBy(repositoryId: String, branch: String): PullRequestBranchSettings?
    fun findBy(repositoryId: String): List<PullRequestBranchSettings>
    fun findAll(): List<PullRequestBranchSettings>
    fun save(settings: PullRequestBranchSettings)
}
