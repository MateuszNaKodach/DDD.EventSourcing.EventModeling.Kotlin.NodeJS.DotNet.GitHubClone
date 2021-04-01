using System;
using System.Net.Http;
using System.Threading.Tasks;
using EventModelingGitHubCloneDotNet.Shared.Domain;
using EventModelingGitHubCloneDotNet.Shared.Infrastructure;
using Microsoft.Extensions.Logging;

namespace EventModelingGitHubCloneDotNet.Slices.Automation.RequiredApprovesBranchProtectionRules.Command
{
    public interface IPullRequestBranchProtectionRules
    {
        Task Satisfy(SatisfyPullRequestProtectionRule command);
        Task Unsatisfy(UnsatisfyPullRequestProtectionRule command);
    }

    class HttpClientPullRequestBranchProtectionRules : IPullRequestBranchProtectionRules
    {
        private static readonly HttpClient HttpClient = new();
        
        public async Task Satisfy(SatisfyPullRequestProtectionRule command)
        {
            var baseUrl =  Environment.GetEnvironmentVariable("ALLOW_MERGING_SERVICE_URL") ??
                       "http://localhost:4000/rest-api";
            var repositoryId = RepositoryId.FromString(command.RepositoryId);
            var postRequest = new
            {
                Url = $"{baseUrl}/{repositoryId.Owner}/{repositoryId.Repository}/pulls/{command.PullRequestId}/allow-merging",
                Body = new { }
            };
            await HttpClient.PostAsync(postRequest.Url, postRequest.Body.ToJson());
            Console.WriteLine($"Protection rule {command.ProtectionRuleId} satisfied for pullRequest {command.PullRequestId}");
        }

        public async Task Unsatisfy(UnsatisfyPullRequestProtectionRule command)
        {
            var baseUrl =  Environment.GetEnvironmentVariable("DISALLOW_MERGING_SERVICE_URL") ??
                           "http://localhost:4000/rest-api";
            var repositoryId = RepositoryId.FromString(command.RepositoryId);
            var postRequest = new
            {
                Url = $"{baseUrl}/{repositoryId.Owner}/{repositoryId.Repository}/pulls/{command.PullRequestId}/disallow-merging",
                Body = new { }
            };
            await HttpClient.PostAsync(postRequest.Url, postRequest.Body.ToJson());
            Console.WriteLine($"Protection rule {command.ProtectionRuleId} unsatisfied for pullRequest {command.PullRequestId}");
        }
    }

    class FakePullRequestBranchProtectionRules : IPullRequestBranchProtectionRules
    {
   
        public Task Satisfy(SatisfyPullRequestProtectionRule command)
        {
            Console.WriteLine($"Protection rule {command.ProtectionRuleId} satisfied for pullRequest {command.PullRequestId}");
            return Task.CompletedTask;
        }

        public Task Unsatisfy(UnsatisfyPullRequestProtectionRule command)
        {
            Console.WriteLine($"Protection rule {command.ProtectionRuleId} unsatisfied for pullRequest {command.PullRequestId}");
            return Task.CompletedTask;
        }
    }
}