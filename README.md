# VPN User Management System

Web application for managing VPN users, access statuses, expiry dates, and basic system activity logs. The project was prepared as part of internship practice work and follows the required repository structure for documentation, source code, database scripts, Docker setup, tests, weekly reports, screenshots, and final delivery materials.

## Current Status

Implemented functionality:

- User authentication with JWT.
- Seed administrator account: `admin@vpn.local / admin123`.
- Protected API routes for VPN users and activity logs.
- VPN user CRUD operations.
- Frontend login page with local session storage.
- Dashboard counters for total, active, inactive, and expired VPN users.
- User search and status filtering.
- User details view.
- Activity log table with action badges for created, updated, and deleted records.
- PostgreSQL connection through the Node.js backend.
- Docker Compose configuration for PostgreSQL.

The main functional requirements are implemented. Final delivery documentation, screenshots, and evidence are stored in the repository folders listed below.

## Technology Stack

- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JSON Web Tokens, bcrypt password hashing
- Frontend: HTML, CSS, vanilla JavaScript
- Development tools: npm, nodemon
- Container support: Docker, Docker Compose

## Project Structure

```text
01_documentation/              Requirements, setup guide, planning documents
02_source_code/
  backend/                     Express API, controllers, routes, middleware, seed script
  frontend/                    HTML/CSS/JavaScript frontend
03_database/                   Database schema and seed SQL files
04_docker/                     Docker Compose files and Docker instructions
05_tests/                      API and integration test documentation
06_weekly_reports/             Weekly internship reports
07_screenshots_and_evidence/   Screenshots and test evidence
08_final_delivery/             Final report and delivery checklist
```

## Backend API Overview

Public routes:

- `GET /api/health` - backend health check
- `GET /api/db-test` - database connection check
- `POST /api/auth/login` - login with email and password

Protected routes:

- `GET /api/users` - get all VPN users
- `GET /api/users/:id` - get one VPN user
- `POST /api/users` - create a VPN user
- `PUT /api/users/:id` - update a VPN user
- `DELETE /api/users/:id` - delete a VPN user
- `GET /api/activity-logs` - get latest activity log entries

## Requirements

Install these tools before running the project:

- Node.js and npm
- Docker Desktop
- PostgreSQL client tools, optional but useful for running SQL manually

## Environment Variables

Create a `.env` file in `02_source_code/backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vpn_management
DB_USER=vpn_user
DB_PASSWORD=vpn_password
JWT_SECRET=change_this_secret_value
```

Do not commit `.env` files. They are already excluded by `.gitignore`.

## Run the Database

From the project root, start PostgreSQL:

```bash
docker compose -f 04_docker/docker-compose.yml up -d
```

Check that the container is running:

```bash
docker compose -f 04_docker/docker-compose.yml ps
```

## Initialize the Database

Run the schema file:

```bash
psql -h localhost -p 5432 -U vpn_user -d vpn_management -f 03_database/2-4_schema.sql
```

The schema creates the `vpn_users`, `activity_logs`, and `system_users` tables.

## Run the Backend

Install dependencies:

```bash
cd 02_source_code/backend
npm install
```

Create the seed administrator account:

```bash
node seed.js
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

## Run the Frontend

Open this file in a browser:

```text
02_source_code/frontend/index.html
```

Login:

```text
Email: admin@vpn.local
Password: admin123
```

## Basic Manual Test Checklist

1. Start PostgreSQL with Docker Compose.
2. Apply the database schema.
3. Create the admin account with `node seed.js`.
4. Start the backend with `npm run dev`.
5. Open the frontend login page.
6. Login as `admin@vpn.local`.
7. Create a VPN user.
8. Edit the VPN user's details.
9. Delete the VPN user.
10. Open Activity Logs and confirm create, update, and delete actions are listed.
11. Refresh the page and confirm the stored session still opens the dashboard.
12. Click Sign Out and confirm the login page is shown.
