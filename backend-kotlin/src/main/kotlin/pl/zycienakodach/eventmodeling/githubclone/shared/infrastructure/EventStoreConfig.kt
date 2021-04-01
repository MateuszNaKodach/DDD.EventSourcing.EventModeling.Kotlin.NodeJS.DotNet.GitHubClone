package pl.zycienakodach.eventmodeling.githubclone.shared.infrastructure

import com.eventstore.dbclient.EventStoreDBClient
import com.eventstore.dbclient.EventStoreDBConnectionString
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "event-modeling.github-clone.event-store-db")
class EventStoreProperties {

    lateinit var connectionString: String
}

@Configuration
class EventStoreConfig(private val eventStoreProperties: EventStoreProperties) {

    @Bean
    fun eventStore(): EventStoreDBClient =
        EventStoreDBClient.create(EventStoreDBConnectionString.parse(eventStoreProperties.connectionString))

}
