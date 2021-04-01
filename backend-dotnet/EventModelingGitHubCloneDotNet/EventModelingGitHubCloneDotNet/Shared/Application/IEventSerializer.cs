using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventStore.Client;

namespace EventModelingGitHubCloneDotNet.Shared.Application
{
    public interface IEventSerializer
    {
        IDomainEvent? Deserialize(ResolvedEvent resolvedEvent);
        EventData Serialize(IDomainEvent domainEvent);
    }
}