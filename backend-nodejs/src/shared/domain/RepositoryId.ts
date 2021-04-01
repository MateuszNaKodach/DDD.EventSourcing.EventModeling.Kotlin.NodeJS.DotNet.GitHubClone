export class RepositoryId {
  constructor(private readonly owner: string, private readonly repository: string) {}

  static fromString(raw: string): RepositoryId {
    const ownerAndRepository = raw.split('+');
    return new RepositoryId(ownerAndRepository[0], ownerAndRepository[1]);
  }

  toString() {
    return `${this.owner}+${this.repository}`;
  }
}
