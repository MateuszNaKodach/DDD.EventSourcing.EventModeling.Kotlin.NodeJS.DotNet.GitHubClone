#!/bin/bash
#https://mariobuonomo.dev/blog/spring-boot-live-reload-docker
gradle --stop
gradle build -x test --continuous --quiet &
gradle bootRun
