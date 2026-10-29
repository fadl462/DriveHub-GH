DriveHub GH — Reviews sort-only fix

UPDATED FILE (keep this exact path):
  command/app.js

WHAT CHANGED
- Review lists sort newest-first using the date returned for each record.
- Sorting applies within the selected status/search filter.
- This patch does not add, delete, or change any review records or statuses.
- It preserves the existing live D1 review loader and status-update API calls.
- It does not reintroduce the browser demo review records.

INSTALL
Replace command/app.js in the DriveHub-GH GitHub repository with the file at the same path in this ZIP, commit, and allow Cloudflare Pages to deploy. Then hard-refresh the Command Centre (Ctrl+Shift+R).

NOTE
This is a code-only package; it has not been deployed to the live Cloudflare account.
