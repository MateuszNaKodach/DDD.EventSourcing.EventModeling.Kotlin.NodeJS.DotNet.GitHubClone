using System.Collections.Generic;
using System.Linq;

namespace EventModelingGitHubCloneDotNet.Shared
{
    public static class EnumerableExtension
    {
        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> o) where T:class
            => o.Where(x => x != null)!;
    }
}