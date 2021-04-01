using System.Threading;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Shared.Application
{
    public interface IApplicationService
    {
        Task ExecuteAsync(string streamName, DomainCommand domainCommand,
            CancellationToken cancellationToken = default);
    }
}