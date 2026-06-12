# Week 3 Delete User Test

## Purpose

This test checks if a VPN user can be deleted from the frontend.

## Frontend action

The Delete button was clicked in the users table.

## Backend endpoint

`DELETE http://localhost:3000/api/users/:id`

## Expected result

The selected VPN user should be deleted from the PostgreSQL database and removed from the frontend table.

## Result

The VPN user was successfully deleted through the frontend interface.

