namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Command
{
    public class SatisfyPullRequestProtectionRule
    {
        public string RepositoryId { get; }
        public string PullRequestId { get; }

        public SatisfyPullRequestProtectionRule(string repositoryId, string pullRequestId)
        {
            RepositoryId = repositoryId;
            PullRequestId = pullRequestId;
        }

        public string ProtectionRuleId => "requiredApproves";
    }
}