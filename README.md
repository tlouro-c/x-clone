# X-Clone

X-Clone is a web application replicating the core functionalities of the social media platform X. This project demonstrates the integration of a Spring Boot backend with a Next.js frontend, utilizing Docker for streamlined deployment.

## Features

- **Backend**: Spring Boot application providing a RESTful API with JWT-based authentication (access and refresh tokens).
- **Frontend**: Next.js application with server-side data fetching for enhanced optimization and backend API privacy.
- **Deployment**: Docker Compose configuration for quick setup on any machine.

## Prerequisites

Ensure the following are installed on your system:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/tlouro-c/x-clone.git
   cd x-clone
   ```

## Create a .env File

In the project's root directory, create a `.env` file with the following environment variables:

```env
# PostgreSQL Database
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name

# Spring Boot Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/your_db_name
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_JWT_SECRET=your_jwt_secret_key
SPRING_MAIL_HOST=smtp.your-email-provider.com
SPRING_MAIL_USERNAME=your_email@example.com
SPRING_MAIL_PASSWORD=your_email_password

# Next.js Configuration
NEXTJS_API_URL=http://springboot:8080/api/v1
```
*Replace placeholder values with your actual configuration.*

## Launch the Application

Execute the following command to start the application:

```bash
docker-compose up
```

This command initializes the services defined in the `docker-compose.yml` file, setting up the application along with its dependencies.

## Application Architecture

- **Backend**: The Spring Boot application communicates exclusively with the PostgreSQL database through the Docker network, ensuring secure data transactions.
- **Frontend**: The Next.js application interacts solely with the Spring Boot backend via the Docker network, making the frontend the only component accessible externally.

## Learning Outcomes

Through this project, the following skills and technologies were applied:

- **Spring Boot**: Development of RESTful APIs and implementation of JWT-based authentication.
- **Next.js**: Utilization of server-side rendering for improved performance and data privacy.
- **Docker**: Configuration of multi-container applications for consistent and efficient deployment.

---

Created with by Tomás Correia.  
Check out my portfolio: [https://tlouro-c.github.io/tomas-lc-portfolio/](https://tlouro-c.github.io/tomas-lc-portfolio/)

