using System;

namespace EventModelingGitHubCloneDotNet.Shared.Domain
{
    public interface IClock
    {
        DateTime Now { get; }
    }
}