Week 2 Create User API Test

Test file:
05_tests/test_user.json

Command:

```
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d @05_tests/test_user.json
```

Expected result:
A new VPN user is created in the PostgreSQL database.

Tested endpoint:
POST http://localhost:3000/api/users

All objectives were successfully achieved. 

![TESTED USER](./week_02_create_user_test.md)
