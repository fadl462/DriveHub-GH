DriveHub GH Command Centre — Fleet Page Fix

Files to replace in the GitHub repository:
- command/index.html
- command/app.js
- command/styles.css

What changed:
- Restores a clear Fleet page section heading and a visible “Add vehicle” button.
- Adds an Add Vehicle form with model/name, registration, daily rate, status, service due date and notes.
- When the live vehicles API is available, the form POSTs to /command/api/vehicles and reloads the fleet from D1. If the live API did not load, it adds to the browser's existing local fleet list instead.
- Improves the fleet card grid and maintenance list sizing at desktop, tablet and mobile widths to reduce clipped content and awkward overflow.

Deployment:
1. Extract the ZIP.
2. Copy the three files into the matching command/ paths in the repository, replacing existing versions.
3. Commit and push to the branch deployed by Cloudflare Pages.
4. After deployment, open Command Centre > Fleet and hard-refresh (Ctrl+F5).

Note: Live database saves require the existing Cloudflare Access staff authentication, D1 binding and vehicle API to be configured. This package does not alter access controls or database schema.
