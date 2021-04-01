using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

namespace EventModelingGitHubCloneDotNet.Shared.Infrastructure
{
    public static class RestApiRequestSerializer
    {
        public static StringContent ToJson(this object obj)
            => new StringContent(JsonConvert.SerializeObject(obj), Encoding.Default, "application/json");
    }
}