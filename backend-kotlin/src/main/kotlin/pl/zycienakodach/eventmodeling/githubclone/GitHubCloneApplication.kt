package pl.zycienakodach.eventmodeling.githubclone

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class GitHubCloneApplication

fun main(args: Array<String>) {
    runApplication<GitHubCloneApplication>(*args)
}
