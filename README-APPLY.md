# DriveHub GH — Order Slip Vehicle Image Fix

Replace the repository-root `styles.css` with the `styles.css` in this ZIP.

## Change
- The vehicle image area now follows an 8:5 aspect ratio, matching the supplied fleet image assets.
- The image uses `object-fit: contain`, so the complete car is visible without being cut off.
- The image uses the full width and height of the upper order-summary panel, with a matching neutral background rather than blank dark side bars.
- The hover zoom is disabled in this panel so it cannot crop the vehicle again.
- The responsive layout keeps the same image proportions on smaller screens.

Only `styles.css` is included. Keep the file at the repository root, commit and push to the branch deployed by Cloudflare Pages, then verify the selected Outlander and at least one other vehicle on Find Your Ride.
