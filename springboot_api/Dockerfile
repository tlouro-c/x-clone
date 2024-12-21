# 1. Use a build stage for the app
FROM maven:latest AS builder
WORKDIR /app

# Copy source code and dependencies
COPY pom.xml .
RUN mvn dependency:resolve

# Copy the rest of the project
COPY src ./src

# Build the app
RUN mvn clean package -DskipTests

# 2. Use a lightweight JRE image for production
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system spring && adduser --system --ingroup spring spring

# Set permissions for /app directory
RUN mkdir -p /app/uploads && chown -R spring:spring /app

# Copy the generated JAR file from the builder stage
COPY --from=builder /app/target/*.jar /app/app.jar

# Use non-root user
USER spring

# Expose the port used by the app
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","/app/app.jar"]
