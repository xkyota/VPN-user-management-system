# 2-4 Final Internship Practice Report

## 1. Student Information

Student name: Maksym Durikhin
Group: PX24
Practice period: 160 hours
Project ID: 2-4
Project name: VPN User Management System
GitHub repository URL: https://github.com/xkyota/VPN-user-management-system

## 2. Project Summary

The goal of the project was to create a small web system for managing VPN users. The final result includes a PostgreSQL database, Node.js/Express backend API, static frontend interface, authentication, protected API routes, VPN user CRUD operations, dashboard statistics, user search and filtering, details view, and activity logs.

The application allows an administrator to sign in, manage VPN user records, track user status and expiry dates, and review recent create, update, and delete actions.

## 3. Requirements Completed

- VPN user records can be created, viewed, updated, and deleted.
- Users include full name, email, VPN username, status, expiry date, and timestamps.
- Backend API is implemented with Express.js.
- PostgreSQL is used as the database.
- Docker Compose starts the PostgreSQL service.
- Frontend page provides forms, tables, dashboard counters, search, filtering, and details view.
- Authentication is implemented with `system_users`, bcrypt password hashing, and JWT.
- Protected API routes require a valid bearer token.
- Activity logs record create, update, and delete actions.
- Final README, database schema, test report, screenshots, weekly reports, and delivery files are prepared.

## 4. System Architecture

The system has three main parts:

- Frontend: static HTML, CSS, and JavaScript in `02_source_code/frontend/`.
- Backend: Node.js and Express API in `02_source_code/backend/`.
- Database: PostgreSQL schema in `03_database/2-4_schema.sql`.

The frontend calls the backend API on `http://localhost:3000`. The backend connects to PostgreSQL using environment variables from `02_source_code/backend/.env`. Docker Compose starts the PostgreSQL container from `04_docker/docker-compose.yml`.

## 5. Database Description

The database contains three main tables:

- `vpn_users`: stores VPN user profile information, VPN usernames, statuses, expiry dates, and timestamps.
- `activity_logs`: stores system activity entries for create, update, and delete events.
- `system_users`: stores administrator login accounts with hashed passwords and roles.

Important constraints:

- `vpn_users.email` is unique.
- `vpn_users.vpn_username` is unique.
- `vpn_users.status` is limited to `active`, `inactive`, or `expired`.
- `system_users.email` is unique.

## 6. Docker Execution

Start PostgreSQL:

```bash
docker compose -f 04_docker/docker-compose.yml up -d
```

Check running containers:

```bash
docker compose -f 04_docker/docker-compose.yml ps
```

Stop PostgreSQL:

```bash
docker compose -f 04_docker/docker-compose.yml down
```

## 7. Testing Summary

Testing covered:

- Backend health check.
- PostgreSQL database connection.
- Database schema creation.
- Admin seed account creation.
- Login with valid credentials.
- Login rejection with invalid credentials.
- Protected API access without token.
- VPN user create, read, update, and delete operations.
- Frontend dashboard counters.
- Search and status filtering.
- Activity log creation and display.
- Logout behavior.
- Responsive mobile layout.

Detailed results are documented in `05_tests/2-4_Final_Test_Report.md`.

## 8. Screenshots

Final screenshots are stored in `07_screenshots_and_evidence/final/`:

- `final_login.png` - login page.
- `final_dashboard.png` - authenticated dashboard and users table.
- `final_activity_logs.png` - activity logs table with action badges.

## 9. GitHub Work Summary

The repository follows the required project structure:

- `01_documentation`
- `02_source_code`
- `03_database`
- `04_docker`
- `05_tests`
- `06_weekly_reports`
- `07_screenshots_and_evidence`
- `08_final_delivery`

Recent work includes authentication, activity logs, frontend UI improvements, database schema updates, final testing documentation, and final delivery packaging.

## 10. Problems and Solutions

One important problem was keeping the database schema synchronized with backend code. Authentication used a `system_users` table, so the final schema was updated to include it.

Another problem was ensuring that unauthenticated users cannot access protected data. This was solved by adding JWT authentication and the `requireAuth` middleware to the user and activity log routes.

The frontend also needed clear session behavior. Login now stores the JWT and user information in `localStorage`, while logout removes the session and returns the user to the login page.

## 11. Self-evaluation

During this project, practical experience was gained in building a full small web application with frontend, backend, database, Docker, authentication, validation, and documentation. The most valuable learning outcomes were connecting Express.js with PostgreSQL, protecting API routes with JWT, and organizing final delivery evidence.

Future improvements could include automated tests, role-specific permissions, pagination for users and logs, and a production deployment configuration.

## 12. Final Checklist

- Source code is committed.
- Docker Compose file is present.
- Database schema is present.
- Test cases are present.
- Weekly reports are present.
- Screenshots are present.
- Final report is completed.
