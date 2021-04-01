namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Command
{
    public class UnsatisfyPullRequestProtectionRule
    {
        public string RepositoryId { get; }
        public string PullRequestId { get; }

        public UnsatisfyPullRequestProtectionRule(string repositoryId, string pullRequestId)
        {
            RepositoryId = repositoryId;
            PullRequestId = pullRequestId;
        }

        public string ProtectionRuleId => "requiredApproves";
    }
}