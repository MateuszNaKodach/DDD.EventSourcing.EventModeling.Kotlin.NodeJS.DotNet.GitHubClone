package pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure

import org.springframework.context.annotation.Configuration
import pl.zycienakodach.eventmodeling.githubclone.shared.application.Projection
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy

@Configuration
class ProjectionsConfig(
    private val projections: List<Projection>
) {

    val projectionsExecutor: ExecutorService = Executors.newFixedThreadPool(4)

    @PostConstruct
    fun postConstruct() {
        projections.forEach { projection ->
            projectionsExecutor.execute { projection.start() }
        }
    }

    @PreDestroy
    fun preDestroy() {
        projections.forEach { projection ->
            projection.stop()
        }
        projectionsExecutor.shutdown()
    }

}
