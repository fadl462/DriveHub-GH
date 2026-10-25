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
