package pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.infrastructure

import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application.PullRequestBranchSettings
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application.PullRequestBranchSettingsRepository
import java.util.concurrent.ConcurrentHashMap

class PullRequestBranchSettingsInMemoryRepository : PullRequestBranchSettingsRepository {

    private val entries = ConcurrentHashMap<String, PullRequestBranchSettings>()

    override fun findBy(repositoryId: String, branch: String) = entries["${repositoryId}_${branch}"]

    override fun findAll() = entries.values.toList()

    override fun save(settings: PullRequestBranchSettings) {
        entries["${settings.repositoryId}_${settings.branch}"] = settings
    }

    override fun findBy(repositoryId: String): List<PullRequestBranchSettings> =
        entries.values.filter { it.repositoryId == repositoryId }

}
