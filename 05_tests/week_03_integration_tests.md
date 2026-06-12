# Week 3 Integration Tests

## Test 1: Load users from backend

Endpoint:

GET http://localhost:3000/api/users

Expected result:

The frontend should load VPN users from the backend and display them in the users table.

Result:

Passed. VPN users were displayed on the frontend page.

---

## Test 2: Create VPN user from frontend

Endpoint:

POST http://localhost:3000/api/users

Expected result:

A new VPN user should be created from the frontend form and saved in PostgreSQL.

Result:

Passed. A new user was created and displayed in the users table.

---

## Test 3: Validate invalid user data

Endpoint:

POST http://localhost:3000/api/users

Expected result:

The backend should reject invalid user data, such as empty name, invalid email, invalid status, or missing expiry date.

Result:

Passed. The backend returned validation error messages.

---

## Test 4: Delete VPN user from frontend

Endpoint:

DELETE http://localhost:3000/api/users/:id

Expected result:

The selected VPN user should be deleted from PostgreSQL and removed from the frontend table.

Result:

Passed. The user was deleted successfully through the frontend interface.