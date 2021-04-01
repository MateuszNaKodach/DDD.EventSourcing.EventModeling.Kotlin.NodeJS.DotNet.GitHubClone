package pl.zycienakodach.eventmodeling.githubclone.shared.domain

data class RepositoryId(val owner: String, val repository: String) {
    override fun toString(): String = "${owner}+$repository"

    companion object {
        fun fromString(raw: String): RepositoryId {
            val ownerAndRepository = raw.split('+')
            return RepositoryId(ownerAndRepository[0], ownerAndRepository[1]);
        }
    }
}
