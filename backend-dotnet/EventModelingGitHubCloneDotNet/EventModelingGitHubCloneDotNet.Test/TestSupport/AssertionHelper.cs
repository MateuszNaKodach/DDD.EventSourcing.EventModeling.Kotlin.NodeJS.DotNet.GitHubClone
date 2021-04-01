using System;
using System.Threading.Tasks;

namespace EventModelingGitHubCloneDotNet.Test.TestSupport
{
    public static class AssertionHelper
    {
        internal static async Task WaitUntil(Func<Task<bool>> condition, TimeSpan? checkDelay = null, TimeSpan? timeout = null)
        {
            var waitTask = Task.Run(async () =>
            {
                while (!await condition())
                {
                    await Task.Delay(checkDelay ?? TimeSpan.FromMilliseconds(500));
                }
            });

            if (waitTask != await Task.WhenAny(waitTask, Task.Delay(timeout ?? TimeSpan.FromSeconds(30))))
            {
                throw new TimeoutException();
            }
        }
    }
}