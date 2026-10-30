DriveHub GH — Consistent Overall Review Rating

Updated files only:
- experience.html
- review-experience.css
- command/app.js

Changes:
1. Public Experience rating displays as a bold, prominent X.X/5.0.
2. Public rating averages only reviews returned by /api/reviews; that endpoint already filters to approved reviews.
3. Command Centre average rating now averages Approved reviews only, matching the public site's approved-review basis. Pending and rejected reviews are excluded.

Important: This does not force the rating to 5.0. It calculates the actual average of approved ratings and rounds to one decimal place. If approved reviews average to 5.0, both places show 5.0/5.0 (public) and 5.0 / 5.0 (Command Centre).

Upload these files preserving their paths in the repository. This ZIP has not been deployed automatically.
