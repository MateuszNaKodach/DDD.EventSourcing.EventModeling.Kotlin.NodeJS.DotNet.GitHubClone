import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "2.4.4"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    kotlin("jvm") version "1.4.31"
    kotlin("plugin.spring") version "1.4.31"
}

group = "pl.zycienakodach.eventmodeling"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

extra["testcontainersVersion"] = "1.15.2"

object Versions {
    const val archUnit = "0.15.0"
    const val assertK = "0.23"
    const val mockK = "1.10.5"
}

dependencies {
    //implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
    //implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    //implementation("org.springframework.kafka:spring-kafka")
    implementation("io.springfox:springfox-boot-starter:3.0.0")

    implementation("org.springframework.boot:spring-boot-devtools")
    //runtimeOnly("org.postgresql:postgresql")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    //testImplementation("org.springframework.kafka:spring-kafka-test")
    //testImplementation("org.testcontainers:junit-jupiter")
    //testImplementation("org.testcontainers:kafka")
    //testImplementation("org.testcontainers:mongodb")
    //testImplementation("org.testcontainers:postgresql")

    implementation("com.eventstore:db-client-java:1.0.0")
    testImplementation("com.willowtreeapps.assertk:assertk-jvm:${Versions.assertK}")
    testImplementation("io.mockk:mockk:${Versions.mockK}")
    testImplementation("org.awaitility:awaitility:4.0.3")
}

dependencyManagement {
    imports {
        mavenBom("org.testcontainers:testcontainers-bom:${property("testcontainersVersion")}")
    }
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "11"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
