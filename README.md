# DriveHub GH — Consolidated Command Centre update

This package combines the two changes so one patch does not undo the other.

## Updated files
- `command/index.html`
- `command/app.js`

## Sidebar order
1. Overview
2. Rentals
3. Invoices
4. Payments & receipts
5. Reviews
6. Fleet
7. Customers
8. Audit trail
9. Reports

Settings remains in its existing bottom-of-sidebar position. Partners & Sourcing is not included in the workspace navigation.

## Invoice page
- Removes the standalone `＋ Create invoice` control.
- States that invoices are generated automatically when a rental is saved.
- Removes the standalone invoice form and its browser-preview creation handler.
- Adds a guard against opening the standalone invoice action.

## Install
Replace the two files at the exact paths above, deploy to Cloudflare Pages, then hard-refresh `/command/`.

## Important
This is a consolidated navigation and invoice-page UI correction. It does not prove that the entire rental-to-invoice-to-payment flow is connected to production D1. Test the backend workflow separately before relying on it for live financial records.
