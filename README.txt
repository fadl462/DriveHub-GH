DriveHub GH — Review card hover refinement

Purpose
- Removes the animated/rotating thin perimeter line from review cards.
- Preserves the existing hover lift and shadow.
- Adds a subtle warm flash on hover.
- Respects reduced-motion preferences.

Install without overwriting existing changes
1. Add review-card-hover-refinement.css to the website root.
2. In experience.html, add this stylesheet link AFTER the existing review-experience.css link:
   <link rel="stylesheet" href="review-card-hover-refinement.css">
3. Commit both changes and let Cloudflare Pages deploy.

Only add the new stylesheet link; do not replace experience.html with an older copy.
This package contains only the new CSS override and this README.
