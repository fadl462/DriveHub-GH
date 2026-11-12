# DriveHub GH Command Centre — Logout update

This package contains only the files changed to add a proper Cloudflare Access logout option.

## Files
- `command/index.html` — adds a visible **Log out** control below the Command Centre profile in the sidebar.
- `command/styles.css` — styles the new control to match the existing Command Centre interface.
- `command/app.js` — asks for confirmation, then sends the browser to the logout endpoint.
- `command/functions/_middleware.js` — allows the logout endpoint to run even if the current Access JWT has expired.
- `command/functions/api/logout.js` — redirects through the Cloudflare Access team logout endpoint and returns the user to the public DriveHub homepage.

## Upload
Copy the `command` folder from this ZIP into the root of your GitHub repository, preserving the folder structure, and commit/push the changes.

## Cloudflare configuration
The logout endpoint reuses the existing `ACCESS_TEAM_DOMAIN` Pages environment variable already used by the Command Centre authentication middleware. It accepts either the team hostname (for example, `your-team.cloudflareaccess.com`) or its `https://` URL.

No D1 migration or database changes are required. No staff records, rental records, invoices, payments, or other business data are modified.

## Expected behaviour
1. Staff select **Log out** in the Command Centre sidebar.
2. A confirmation prompt appears.
3. On confirmation, the browser visits `/command/api/logout`.
4. Cloudflare Access ends the team session and returns the browser to the public DriveHub homepage.
5. Reopening the protected Command Centre requires authentication again.

The JavaScript files were checked with Node.js syntax validation. This package has not been pushed to GitHub or deployed to Cloudflare; that happens after you upload and commit the files.
