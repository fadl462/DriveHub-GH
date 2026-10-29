DriveHub GH Command Centre — Remove Interactive Preview Banner

Files to replace at the same paths in the GitHub repository:
- command/index.html
- command/app.js

Change:
- Removes the persistent “Interactive preview” warning banner from the Command Centre shell, so it no longer appears when navigating between sections.
- Removes the obsolete dismiss-button event handler.

This is a presentation-only change. It does not modify D1 records, API routes, access checks, or database behavior.

Deploy:
1. Copy these files into the matching paths in the DriveHub-GH repository.
2. Commit and push to the branch connected to Cloudflare Pages.
3. After deployment, hard-refresh the Command Centre with Ctrl+F5.

Note: This removes the warning banner, but it does not convert any remaining browser-preview modules to database-backed modules.
