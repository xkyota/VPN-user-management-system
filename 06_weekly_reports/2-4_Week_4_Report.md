# 2-4 Weekly Report - Week 4

## Student Information

Student name: Maksym Durikhin
Group: PX24
Project ID: 2-4
Project name: VPN User Management System
Week number: 4

## Planned Work For This Week

Testing, bug fixing, final documentation, screenshots, final report, GitHub cleanup, and preparation of the final delivery folder.

## Completed Work

- Added authentication flow with system users, JWT login, and logout.
- Protected API routes with `requireAuth` middleware.
- Added login page to the frontend.
- Added header user information with email, role, and sign out button.
- Added activity logs API and frontend activity log table.
- Added visual badges for created, updated, and deleted log actions.
- Updated CSS for login page, authenticated header, tables, and responsive layout.
- Updated database schema with the `system_users` table.
- Prepared final README with setup, run, stack, API, and testing instructions.
- Prepared final test documentation.
- Prepared final screenshots and final delivery documentation.

## GitHub Commits

- `215faf5` - feat: add JWT auth, login page, activity logs UI
- `7c07761` - Add activity logs
- `f7a7e91` - Add activity logs API
- `89b8567` - Add user detail view
- `dda65fb` - Add frontend dashboard summary
- `45c1733` - Add frontend user search and status filtering
- `f3a84e8` - Add frontend edit and update user functionality

## Screenshots / Evidence

Final screenshots:

- `../07_screenshots_and_evidence/final/final_login.png`
- `../07_screenshots_and_evidence/final/final_dashboard.png`
- `../07_screenshots_and_evidence/final/final_activity_logs.png`
- `../07_screenshots_and_evidence/final/final_mobile_view.png`

Final documentation:

- `../README.md`
- `../05_tests/2-4_Final_Test_Report.md`
- `../08_final_delivery/2-4_07_Final_Internship_Report.md`
- `../08_final_delivery/2-4_Final_Delivery_Index.md`

## Problems Found

The final review found that the backend authentication code used the `system_users` table, but the main SQL schema file did not yet define this table. This could prevent a clean setup on a new machine.

Another issue was that final delivery documentation still existed mostly as templates and needed to be completed with actual project results.

## Solutions Applied

The `system_users` table was added to `03_database/2-4_schema.sql`. The final README, test report, weekly report, final internship report, and final delivery index were prepared so the project can be reviewed and submitted as a complete package.

## Next Week Plan

No further development week is planned. The project is ready for final review and submission after the GitHub repository is updated.

## Supervisor Notes

To be completed by the practice supervisor if needed.
