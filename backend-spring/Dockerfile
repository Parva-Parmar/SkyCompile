FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy maven executable and metadata
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execution permission to maven wrapper
RUN chmod +x ./mvnw

# Resolve dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code and build
COPY src src
RUN ./mvnw package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
