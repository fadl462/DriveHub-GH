DriveHub GH — Safe Partner-Sourcing D1 Migration

IMPORTANT
- Run against the production D1 database bound to the Command Centre as DB: drivehub-command-db.
- Back up the database first.
- Run each .sql file separately in the D1 Console, in numeric order, and click Execute after each file's one SQL statement.
- Confirm each command succeeds before moving to the next.
- The screenshot you provided shows none of the five partner-sourcing columns currently exist on rentals, so these ALTER TABLE statements are appropriate for the schema shown.
- If any ALTER TABLE statement returns “duplicate column name”, STOP; do not continue. Send the exact error because the schema may have changed since the screenshot.
- If any other statement fails, stop and send the exact error.
- Do not run the original multi-statement migration as one pasted block. This package splits it into one statement per file to make console execution and error diagnosis clearer.
- This migration does not delete or modify existing rental/customer/invoice/payment rows. It creates partner-sourcing tables and adds five nullable/defaulted sourcing columns to rentals.
After all 14 statements succeed, test Add rental partner and confirm the partner appears in the Partners & Sourcing list.
