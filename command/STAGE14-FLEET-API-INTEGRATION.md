# Stage 14 — Fleet API integration

This package updates only `command/app.js` plus this checklist. Upload the files into the existing repository `command/` directory; do not upload anything into the repository root.

## Included
- Requests `GET /command/api/vehicles` on startup and whenever Fleet is opened.
- Maps D1 vehicle records to the existing fleet cards.
- Adds an **Add vehicle** form that posts to `POST /command/api/vehicles`.
- Converts GH₵ daily rates to/from integer pesewas (`daily_rate_minor`) for API storage.
- Shows an explicit success or failure message and does not claim a vehicle was saved if the API request fails.
- Retains preview data if the API cannot be reached.

## Deploy and test
1. Upload `app.js` and this checklist to `DriveHub-GH/command/` on the `main` branch, preserving the folder structure.
2. Wait for Cloudflare Pages to finish deploying.
3. Open `https://drivehub-gh.pages.dev/command/`, sign in through Cloudflare Access if prompted, and open **Fleet**.
4. Click **Add vehicle** and enter a clearly labelled test vehicle, e.g. `TEST Fleet Vehicle`, with a unique test registration, status `Available`, and daily rate `100`.
5. Confirm the success message, then run this query in Cloudflare D1 Console:

```sql
SELECT id, name, registration_number, daily_rate_minor, status, service_due_on, created_at
FROM vehicles
ORDER BY created_at DESC
LIMIT 10;
```

6. Refresh Fleet and verify the test vehicle remains visible. Clean up the test record after verification only if you are certain it is not needed.

## Important limitations
- This stage wires the Fleet interface to the existing vehicle API only. Rentals, maintenance, invoices, payments, dashboard KPIs, and the audit page still contain browser-preview logic and must not be treated as fully database-backed.
- Keep Cloudflare Access and the D1 binding enabled.
- The “Interactive preview” notice is intentionally retained because other modules still use sample/browser-local data.
- Before live business use, verify role enforcement, audit-log writes, data validation, and the complete end-to-end workflow.
