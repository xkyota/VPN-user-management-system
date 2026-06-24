# 2-4 Database Design

## Required Database Objects

The project uses a relational PostgreSQL database. The final SQL schema is stored in `03_database/2-4_schema.sql`.

## Final Tables

```sql
CREATE TABLE vpn_users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    vpn_username VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'expired')),
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Table Descriptions

- `vpn_users` is the main application table. It stores the managed VPN users, their unique email addresses, unique VPN usernames, access status, expiry dates, and timestamps.
- `activity_logs` stores audit-style entries for user actions such as create, update, and delete.
- `system_users` stores administrator login accounts with hashed passwords and roles.

## Constraints And Data Rules

- `vpn_users.email` must be unique.
- `vpn_users.vpn_username` must be unique.
- `vpn_users.status` must be `active`, `inactive`, or `expired`.
- `system_users.email` must be unique.
- Passwords are stored as bcrypt hashes in `system_users.password_hash`.

## Seed Data

The backend seed script creates the default administrator account:

```text
admin@vpn.local / admin123
```

## Required Deliverables

- Entity relationship description: included in this file.
- SQL schema file: `03_database/2-4_schema.sql`.
- Seed data file: `02_source_code/backend/seed.js` and SQL seed files in `03_database/`.
- Short explanation of each table: included above.
- Screenshot proving that the database runs in Docker: stored in `07_screenshots_and_evidence/week_01/`.
