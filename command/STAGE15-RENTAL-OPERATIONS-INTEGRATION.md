# Stage 15 — Rental Operations Integration (API foundation)

This stage adds `functions/api/rentals.js` for D1-backed rental listing and creation.

## Endpoints

- `GET /command/api/rentals?limit=100`
- `GET /command/api/rentals?status=active`
- `GET /command/api/rentals?from=2026-10-01&to=2026-10-31`
- `POST /command/api/rentals`

POST JSON:
```json
{
  "customer_id": "existing-customer-id",
  "vehicle_id": "existing-vehicle-id",
  "pickup_date": "2026-11-01",
  "return_date": "2026-11-05",
  "status": "upcoming",
  "notes": "Optional notes"
}
```

The server resolves the daily rate from the selected D1 vehicle record and calculates billable days inclusively (pickup day and return day both count). The client cannot override the saved vehicle rate or billable-day count.

## Controls implemented

- Access middleware/staff-role checks must already be configured.
- Reads are limited to 200 rows.
- Only `admin` and `operations` can create rentals.
- Date format and duration are validated.
- Customer and vehicle foreign records must exist.
- `upcoming` and `active` rentals are checked for overlapping rental dates.
- Vehicles in `maintenance` or `inactive` status are rejected.
- A maintenance conflict check uses the current schema's `maintenance_records.due_on` date.
- Creation writes an audit entry.

## Important scope limitation

This is the **server/API foundation only**. The current Command Centre rental form and rental table still use browser-local demo state and are not yet wired to this endpoint. Do not treat the Command Centre as fully integrated or enter real rental/financial data until the frontend is connected and the Access/D1 role setup is tested. The current schema has only one `due_on` field for maintenance, so multi-day maintenance overlap cannot be fully enforced by this endpoint yet; that requires extending the schema with a service start/end range.

## Deployment

1. Extract this ZIP.
2. Upload `command/functions/api/rentals.js` into the existing `command/functions/api/` folder in the GitHub repository.
3. Commit and wait for Cloudflare Pages deployment.
4. Verify the GET endpoint in an authenticated session.
5. Test creation only with a disposable development customer and vehicle.
6. Verify the rental row and `audit_log` row in D1, and remove test data afterward.

Never test POST against production customer/vehicle data until staff authentication and permissions are verified.
