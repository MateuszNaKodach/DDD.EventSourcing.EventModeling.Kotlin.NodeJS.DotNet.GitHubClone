using System;
using EventModelingGitHubCloneDotNet.Shared.Application;

namespace EventModelingGitHubCloneDotNet.Shared.Infrastructure
{
    public class GuidGenerator : IGuidGenerator
    {
        public Guid Generate()
        {
            return Guid.NewGuid();
        }

        public string GenerateString()
        {
            return Generate().ToString("N");
        }
    }
}