DriveHub GH — Public and Command Centre Rating Consistency

Upload these updated files to the repository, preserving paths:
- command/app.js
- experience.html
- review-experience.css

Fixes:
- Command Centre average rating now includes approved reviews only. Pending and rejected reviews no longer affect the headline average.
- Public Experience page uses the same approved-review dataset returned by /api/reviews and displays the rating as X.X / 5.0 with stronger visual emphasis.
- Review CTA reads “Write a review” without a pointing arrow.

Calculation note:
The average is calculated from approved review ratings and rounded to one decimal place. It is not hard-coded to 5.0; if the approved reviews average to 5.0, both surfaces should show 5.0 / 5.0. This package has not been deployed and cannot verify live D1 records.
