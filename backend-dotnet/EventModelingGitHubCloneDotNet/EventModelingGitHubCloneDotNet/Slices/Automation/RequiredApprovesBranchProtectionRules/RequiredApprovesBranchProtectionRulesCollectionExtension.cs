using EventModelingGitHubCloneDotNet.Shared.Application;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Command;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Event;
using EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.State;
using EventStore.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules
{
    public static class RequiredApprovesBranchProtectionRulesCollectionExtension
    {
        public static IServiceCollection AddRequiredApprovesBranchProtectionRulesSlice(
            this IServiceCollection services,
            EventStoreClient eventStore,
            IPullRequestBranchProtectionRules branchProtectionRules,
            IRequiredApprovesRepository? rulesRepository = null,
            IPullRequestReviewsRepository? approvesRepository = null
        )
        {
            IRequiredApprovesRepository requiredApprovesRepository =
                rulesRepository ?? new InMemoryRequiredApprovesRepository();
            IPullRequestReviewsRepository pullRequestReviewsRepository =
                approvesRepository ?? new InMemoryPullRequestReviewsRepository();
            IEventSerializer eventSerializer = new RequiredApprovesBranchProtectionRulesSerializer();
            return services
                .AddSingleton(branchProtectionRules)
                .AddHostedService(serviceProvider => new BranchProtectionRuleAutomation(
                    eventStore,
                    eventSerializer,
                    requiredApprovesRepository,
                    pullRequestReviewsRepository,
                    branchProtectionRules,
                    serviceProvider.GetService<ILogger<BranchProtectionRuleAutomation>>()!
                ));
        }
    }
}