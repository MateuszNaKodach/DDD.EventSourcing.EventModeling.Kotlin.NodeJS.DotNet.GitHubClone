package pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.presentation

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.zycienakodach.eventmodeling.githubclone.slices.read.readrequiredapproves.application.PullRequestBranchSettingsRepository
import pl.zycienakodach.eventmodeling.githubclone.shared.domain.RepositoryId

@RequestMapping("/rest-api")
@RestController
class BranchRequiredApprovesController(private val repository: PullRequestBranchSettingsRepository) {

    @GetMapping("/{owner}/{repository}/settings/branch-protection-rules/required-approves")
    fun getBranchRequiredApproves(
        @PathVariable owner: String,
        @PathVariable repository: String,
    ) = this.repository.findBy(RepositoryId(owner, repository).toString())

}
