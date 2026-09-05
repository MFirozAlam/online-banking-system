# Online Banking System - Backend

## Stack
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- BCrypt password hashing

## Run
1. Start MySQL.
2. Create/use database `banking_app` (the JDBC URL can create it automatically).
3. Set your MySQL password:
   - Windows PowerShell: `$env:DB_PASSWORD="your-password"`
   - Or replace `YOUR_MYSQL_PASSWORD` in `src/main/resources/application.properties`.
4. Run:
   `.\mvnw.cmd spring-boot:run`

Backend runs on `http://localhost:8080`.

## Main endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/accounts`
- `GET /api/accounts`
- `GET /api/accounts/{id}`
- `PUT /api/accounts/{id}/deposit`
- `PUT /api/accounts/{id}/withdraw`
- `DELETE /api/accounts/{id}`
- `POST /api/transactions/transfer`
- `GET /api/transactions/account/{accountId}`
- `GET /api/transactions`

Passwords are stored using BCrypt, and transaction balance updates are transactional.
