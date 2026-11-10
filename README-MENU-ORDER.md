# DriveHub GH Command Centre menu order

## Updated file
- `command/index.html`

## Changes
The main workspace menu now appears in this order:
1. Overview
2. Rentals
3. Invoices
4. Payments & receipts
5. Reviews
6. Fleet
7. Customers
8. Audit trail
9. Reports

The Reviews badge starts at `0` and is updated by the existing application logic from the live pending-review count. The JavaScript query version was incremented to avoid stale browser cache.

Partners & Sourcing is not present in this source navigation. Settings remains in the existing bottom-of-sidebar area and was not changed.

## Installation
Replace `command/index.html` at the same path in the project and deploy the updated site. Then hard-refresh the Command Centre.
