using System;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Shared.Infrastructure
{
    public class SystemDefaultClock : IClock
    {
        public DateTime Now => DateTime.UtcNow;
    }
}