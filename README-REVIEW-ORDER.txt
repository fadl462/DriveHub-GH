DriveHub GH Command Centre — newest reviews first

Updated file: command/app.js

Change:
- The Reviews list now sorts matching records by submittedAt/submitted_at/date/createdAt descending, so the newest review appears at the top in each selected status filter and in All reviews.
- No database records are changed and no migration is required.

Deployment:
1. In the DriveHub-GH GitHub repository, replace command/app.js with the file in this package, preserving the exact path.
2. Commit the change and allow Cloudflare Pages to deploy.
3. Reload DriveHub Command and open Reviews. If the browser shows the previous version, hard-refresh with Ctrl+Shift+R.
