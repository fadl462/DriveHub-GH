# API implementation notes

This directory is reserved for the production Cloudflare Worker API. No live API handlers are shipped in this frontend preview because they must be connected to a configured D1 database, authentication provider, and permission model before they can safely accept personal or financial data.

Recommended endpoint contracts:
- `GET /api/reviews?status=Pending`
- `PATCH /api/reviews/:id` — approve/reject; require reviewer permission and create an audit event
- `GET/POST /api/invoices`
- `GET/POST /api/payments` — server validates invoice balance and writes payment + audit event transactionally
- `GET/POST /api/rentals`
- `GET/POST /api/fleet`
- `GET/POST /api/customers`
- `GET /api/reports/:type`

All endpoints must authenticate and authorise on the server. Never rely on a hidden UI button or a client-supplied role to enforce access.
