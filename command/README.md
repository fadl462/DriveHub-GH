# DriveHub Command — Operations Dashboard Preview

This is a standalone, responsive frontend prototype for the DriveHub GH internal management platform. It is designed to be placed in a `command/` folder in the existing DriveHub-GH repository so it does not overwrite or interfere with public website pages.

## Included modules
- Executive overview, revenue visualisation, attention queue
- Review moderation queue (approve/reject status actions in the local demo)
- Invoice list and create-invoice form with inclusive rental-day calculation
- Payment recording and receipt register
- Rental register and inclusive billable days
- Fleet status and maintenance notes
- Customer directory
- CSV exports and report cards
- Company preferences screen and production-readiness checklist
- Responsive desktop/mobile navigation

## Install as a preview
1. Download and extract this package.
2. Copy the included `DriveHub-Command` folder into the root of the `DriveHub-GH` GitHub repository.
3. Rename the folder to `command` (lowercase recommended).
4. Commit and push the folder. Cloudflare Pages should publish it at `/command/`.
5. Open `https://drivehub-gh.pages.dev/command/`.

Only this new folder is included. It does not replace the current homepage, stylesheet, fleet page, review page, or any existing assets.

## Important: preview, not production
This package is an interactive frontend prototype. Its sample records are demonstration data, stored in this browser using `localStorage`. They are not actual customer records, and changes are not shared between staff or devices. The login/authentication, server-side database, secure file storage, server-side audit trail, real public review submission integration, and production PDF invoice/receipt generation are **not connected** in this preview.

Do not use it to store real personal information or treat its sample financial figures as actual company accounts.

## Recommended production architecture
- Cloudflare Pages for the frontend
- Cloudflare Workers for authenticated API routes
- Cloudflare D1 for relational business records
- Cloudflare R2 for optional portrait uploads and generated documents
- Cloudflare Access or a proper identity provider for staff authentication, plus role-based authorisation in API routes
- Server-side audit events for approvals, invoice issuance, payment records and edits

The existing public review form should POST to a server-side endpoint that validates input, stores the review as `Pending`, and accepts optional portrait files only after validating file type, size, and access permissions. The management screen should fetch reviews from that database and publish only approved records. Do not implement public publishing by trusting a browser-only status flag.

## Business rules to preserve
- Rental days count both pickup and return dates. Example: 10 October through 14 October = 5 billable days.
- Payments must be validated server-side against the invoice's remaining balance.
- Invoice and receipt numbers must be assigned server-side to prevent duplicates.
- Financial changes should be append-only or auditable; do not silently erase payment history.
- Every staff API route must check identity and permissions server-side.

## Before launch checklist
- [ ] Configure staff authentication and roles
- [ ] Create D1 database and apply production schema
- [ ] Build authenticated Worker APIs
- [ ] Connect existing review form to persistent storage
- [ ] Secure optional photo uploads
- [ ] Add server-side audit logging
- [ ] Implement PDF invoice and receipt generation
- [ ] Test validation, authorisation, backup and recovery
- [ ] Replace demo records with verified business data
- [ ] Test on mobile and desktop


## Stage 1 improvements in this update
- Executive KPIs now calculate recorded revenue from payment records, outstanding balances from invoice totals less payments, active rentals from rental dates/status, and utilisation from assigned fleet records.
- Revenue chart now aggregates actual payment records by calendar month rather than displaying a fixed illustrative series.
- Invoice status is derived from remaining balance and due date when rendered.
- Rental creation now rejects invalid dates and overlapping bookings for the same vehicle.
- Payment entry now requires a valid invoice and date and prevents overpayment.
- Demo notice now clearly explains that records remain local to the current browser.
- This remains a browser-only preview: these improvements do not provide shared storage, authentication, server-side validation or production accounting controls.


## Official brand update
- Replaced the placeholder red “D” tile and text lockup with the official DriveHub GH logo supplied in the brand asset package.
- Added `drivehub-logo.svg` to the Command folder and sized it responsively in the sidebar.
- Kept the logo asset local to `/command/` so the dashboard does not depend on a third-party host.


## Stage 2 — Rental operations
- Added per-rental Edit and Complete actions.
- Editing validates dates and prevents overlapping bookings for the same vehicle.
- Completing a rental updates its status and refreshes overview/fleet/rental views.
- Added an Actions column to the rentals table.
- These actions remain demo/browser-local until the shared database and server-side authorization stage is implemented.


## Logo prominence and placement fix
- Cropped the official vector logo's square artboard to the actual wide logo artwork, so the wordmark renders at a readable size.
- Positioned the logo at the top-left of the Command sidebar, matching the public website's prominent brand treatment.
- Kept the Command / Operations Centre label beneath the logo rather than shrinking the logo beside it.


## Final logo lockup correction
- Repositioned the official DriveHub GH logo horizontally at the top-left of the Command Centre sidebar.
- Moved COMMAND / OPERATIONS CENTRE text to the right of the logo.
- Increased the logo's rendered width and height while keeping its aspect ratio and the existing official SVG asset.
- Added high-specificity responsive CSS overrides to prevent earlier stacked-logo rules from taking precedence.


## Stage 4 — Customer management
- Added an Add customer workflow for name, email, phone and optional notes.
- Validates customer name plus at least one contact method and checks likely duplicates by name, email or phone.
- Added View profile with linked rental history and invoice balances.
- Customer profile calculates billed outstanding balances from invoice records and payment totals from the local demo state.
- Updated customer directory actions and responsive profile dialog styling.
- Data remains browser-local demonstration data; production use requires shared database persistence, authentication and server-side validation.
