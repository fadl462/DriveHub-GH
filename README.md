# DriveHub GH Command Centre — Route restore correction

Replace these files in the project:
- command/index.html
- command/app.js
- functions/command/api/rentals.js (retained from the safe rental-deletion patch)

This revision writes the selected section to the URL hash using `location.hash`, stores it in session and local storage, restores from the URL first on startup, and re-checks the route on browser `pageshow` and `hashchange`. The app script version is bumped to avoid stale browser/edge cache.

After deploying to Cloudflare Pages:
1. Open Command Centre and select Rentals.
2. Confirm the address ends in `#rentals`.
3. Press Ctrl+F5 (hard refresh).
4. Confirm Rentals remains selected.
5. Repeat for Invoices and Payments.

This is a code patch, not a deployment confirmation.
