using System;

namespace EventModelingGitHubCloneDotNet.Shared.Application
{
    public interface IGuidGenerator
    {
        Guid Generate();
        String GenerateString();
    }
}