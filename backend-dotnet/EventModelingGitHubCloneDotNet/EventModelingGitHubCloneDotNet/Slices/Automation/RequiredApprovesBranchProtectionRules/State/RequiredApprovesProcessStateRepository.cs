using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.State
{
    public interface IRequiredApprovesRepository
    {
        Task Save(RequiredApprovesBranchProtectionRule state);
        Task<RequiredApprovesBranchProtectionRule?> FindBy(string repositoryId, string branch);
    }

    class InMemoryRequiredApprovesRepository : IRequiredApprovesRepository
    {
        private readonly ConcurrentDictionary<string, RequiredApprovesBranchProtectionRule> _entities = new();
        
        public Task Save(RequiredApprovesBranchProtectionRule state)
        {
            _entities[$"{state.RepositoryId}+{state.Branch}"] = state;
            return Task.CompletedTask;
        }

        public Task<RequiredApprovesBranchProtectionRule?> FindBy(string repositoryId, string branch)
        {
            var stateId = $"{repositoryId}+{branch}";
            if (!_entities.ContainsKey(stateId))
            {
                return Task.FromResult<RequiredApprovesBranchProtectionRule?>(null);
            }
            return Task.FromResult<RequiredApprovesBranchProtectionRule?>(_entities[stateId]);
        }
    }
}