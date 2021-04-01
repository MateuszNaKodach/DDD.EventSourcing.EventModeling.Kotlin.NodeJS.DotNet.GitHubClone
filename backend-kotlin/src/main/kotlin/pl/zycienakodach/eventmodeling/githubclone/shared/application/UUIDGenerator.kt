package pl.zycienakodach.eventmodeling.githubclone.shared.application

import org.springframework.stereotype.Service
import java.util.*

@Service
class UUIDGenerator {

    fun generate(): UUID = UUID.randomUUID();
}
