FROM gradle:6.8.3-jdk11
WORKDIR /app/kotlin/
COPY . .

RUN gradle build -x test

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/kotlin/build/libs/githubclone-0.0.1-SNAPSHOT.jar"]
