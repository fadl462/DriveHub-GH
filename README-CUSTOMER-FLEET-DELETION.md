# DriveHub GH — Customer and Fleet Delete Controls

## Included
- Adds a Delete action to customer rows and a Delete vehicle action to fleet cards.
- Requires a warning confirmation followed by typing the exact word `DELETE`.
- Blocks customer deletion when local preview data shows linked rentals, invoices, or payments.
- Blocks vehicle deletion when local preview data shows linked rentals, maintenance, or sourced-vehicle references.
- Refreshes affected views and records an entry in the current preview's local audit log after deletion.

## Critical deployment limitation
This package updates the browser preview UI only. The existing production APIs for customers and vehicles do not yet expose audited DELETE handlers. This package does not perform production D1 deletions and does not change server permissions or schema. Do not treat a successful preview deletion as a live database deletion. For production, add server-side dependency checks and transactional/audited delete endpoints, then connect these buttons to those endpoints. The preview's local audit log is not a durable server audit record.
