namespace EventModelingGitHubCloneDotNet.Shared.Domain
{
    public class RepositoryId
    {
        public string Owner { get; }
        public string Repository { get; }

        public RepositoryId(string owner, string repository)
        {
            Owner = owner;
            Repository = repository;
        }

        public static RepositoryId FromString(string raw)
        {
            var ownerAndRepository = raw.Split("+");
            return new RepositoryId(ownerAndRepository[0], ownerAndRepository[1]);
        }

        public override string ToString()
        {
            return $"{Owner}+{Repository}";
        }
    }
}