using System.Collections.Generic;

namespace EventModelingGitHubCloneDotNet.Shared.Domain
{
    public delegate IEnumerable<IDomainEvent> DomainCommand(IEnumerable<IDomainEvent> history);
}