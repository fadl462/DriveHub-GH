# DriveHub Command API contract (Stage 12 scaffold)

This document defines the first API boundary. The app is **not yet wired to these routes** and the protected routes intentionally return HTTP 503 until authentication and authorization are implemented.

## Initial route plan

| Method | Route | Purpose | Minimum authorization |
|---|---|---|---|
| GET | `/api/health` | Report whether a D1 binding exists | Public, no business data |
| GET/POST | `/api/customers` | List/create customers | `operations` or `admin` |
| GET/POST | `/api/vehicles` | List/create vehicles | Read access / `operations` / `admin` |
| GET/POST | `/api/rentals` | List/create rentals with transactional availability checks | `operations` or `admin` |
| GET/POST | `/api/invoices` | List/create invoices | `finance` or `admin` |
| GET/POST | `/api/payments` | List/create payments | `finance` or `admin` |
| GET/PATCH | `/api/reviews` | Review moderation | `review_moderator` or `admin` |
| GET/POST | `/api/maintenance` | Schedule/complete maintenance | `operations` or `admin` |
| GET | `/api/reports/*` | Authorized aggregate reports | Role-limited by data sensitivity |

## Required handler behavior before launch

1. Verify the Cloudflare Access JWT signature, issuer, audience and expiry using the configured team domain and application AUD. Never trust a raw email header as proof of identity.
2. Map verified identity to an active `staff_users` row and enforce its role server-side on every request.
3. Validate request body types, allowed status transitions, dates, integer currency values, and maximum payload sizes.
4. Use prepared/bound SQL parameters, foreign keys, and database transactions where multiple writes must succeed together.
5. For rentals, enforce no overlapping active booking and no active maintenance overlap in server-side SQL/transaction logic.
6. Write audit events for every sensitive create/update/status change. Do not expose audit-log mutation endpoints to ordinary staff.
7. Return only necessary customer data; add pagination and consistent error responses.
8. Add tests for unauthenticated, unauthorized, duplicate, invalid, overlapping, and successful requests.

## Current status

- `/api/health` is implemented.
- Protected API routes fail closed with HTTP 503.
- No login, D1 data handlers, frontend API integration, or production authentication has been implemented.
