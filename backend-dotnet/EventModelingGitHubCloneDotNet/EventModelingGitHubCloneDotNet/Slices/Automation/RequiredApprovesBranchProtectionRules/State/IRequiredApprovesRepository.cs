namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.State
{
    public class RequiredApprovesBranchProtectionRule
    {
        public string RepositoryId { get; init; }

        public string Branch { get; init; }
        public int RequiredApprovingReviews { get; init; }

        public RequiredApprovesBranchProtectionRule WithRequiredApprovingReviews(int requiredApprovingReviews) =>
            new()
            {
                RepositoryId = RepositoryId,
                Branch = Branch,
                RequiredApprovingReviews = requiredApprovingReviews,
            };
    }
}