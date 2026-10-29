DriveHub GH — Customer Improvement Feedback on Overview

Updated files only:
- command/index.html — adds the private customer-improvement panel to Overview.
- command/app.js — renders live improvement feedback from the existing D1 reviews list; newest first; provides status updates and internal management notes.
- functions/command/api/reviews.js — persists improvement status/notes through the existing authenticated staff API, without changing public approval status.
- command/migrations/0004_customer_improvement_management.sql — adds persistent workflow fields to reviews.

Deployment steps:
1. Extract these files into the root of the DriveHub-GH repository, preserving paths.
2. Apply command/migrations/0004_customer_improvement_management.sql to the existing drivehub-command-db D1 database once. Do not re-run an ALTER TABLE migration after it succeeds.
3. Commit and push the code to GitHub and wait for Cloudflare Pages deployment.
4. Open Command Centre > Overview and verify feedback/status updates while signed in as an authorised staff member.

Safety notes:
- Does not seed demo records or alter existing review publication statuses.
- What could improve remains in the authenticated Command Centre API, not the public API.
- Statuses/notes are persisted in D1. Staff roles allowed to manage them: admin, review_moderator, operations.
- Requires the existing reviews table and authenticated Command Centre API deployment to be configured.
