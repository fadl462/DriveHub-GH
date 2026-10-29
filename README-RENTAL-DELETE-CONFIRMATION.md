# DriveHub GH — Rental Delete Confirmation (updated files only)

Files included: `command/app.js`, `command/index.html`, and `command/styles.css`. Copy these files to the same paths in the repository.

## Included
- Adds a visually distinct Delete action to each standard rental row.
- Displays a warning listing the rental and its linked unpaid invoice records.
- Requires a second confirmation: the staff member must type exactly `DELETE`.
- Deletes the rental and its linked invoice record(s) from the current browser preview, then refreshes the relevant views.
- Writes a local audit entry.
- Blocks deletion if linked payment/receipt rows exist or an invoice has a positive paid amount.
- Blocks deletion of partner-sourced rentals because those records and supplier obligations are stored separately and need a server-side dependency-aware delete/reversal workflow.

## Important limitation
This update follows the current `command/app.js` preview architecture for standard rentals. The current standard rental/invoice/payment handlers in that frontend still include browser-local state. This ZIP does **not** implement a production D1 deletion API, does not delete D1 records, and does not make the browser audit log tamper-proof. Do not treat this as a live database deletion workflow until the backend and its schema/dependencies are implemented and tested. No deployment is performed by this ZIP.


## Rentals page layout refinement
- Removed the duplicate “Rental operations” heading and descriptive sentence from inside the page content. The main page heading remains.
- Hid the global “Export overview” and “Quick action” buttons only while the Rentals view is active; they remain available on other views. The dedicated “Add rental” action remains visible.
