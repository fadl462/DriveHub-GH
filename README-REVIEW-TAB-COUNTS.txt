DriveHub GH Command Centre — Review Tab Counts

Files to upload, preserving their paths:
- command/app.js
- command/index.html

Change:
Each Reviews & reputation tab now displays a live count for its own status: Pending, Approved, Rejected, and All reviews. Counts are calculated from the reviews currently loaded by the Command Centre and are not affected by the search text or the currently selected tab. The counts refresh whenever the reviews are rendered, including after the review data is loaded or a status changes.

This is a frontend-only change. It does not modify review records, the D1 schema, review publication rules, or APIs.
