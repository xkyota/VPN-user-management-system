# Week 3 Validation Test

## Purpose

This test checks if the backend validates VPN user data before creating a new user.

## Test file

`05_tests/invalid_user.json`

## Command

```bash
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d @05_tests/invalid_user.json
```