using System;
using EventModelingGitHubCloneDotNet.Shared.Domain;

namespace EventModelingGitHubCloneDotNet.Shared.Infrastructure
{
    public class FixedClock : IClock
    {
        public DateTime Now { get; }

        public FixedClock(DateTime now) => Now = now;
    }
}