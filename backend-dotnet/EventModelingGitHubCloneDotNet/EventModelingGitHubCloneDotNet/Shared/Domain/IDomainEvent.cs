using System;

namespace EventModelingGitHubCloneDotNet.Shared.Domain
{
    public interface IDomainEvent
    {
        public DateTime OccurredAt { get; init; }
    }
}