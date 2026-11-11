# DriveHub GH — Full Vehicle Images on the Order Slip

Replace these two files at their existing repository-root paths:
- `script.js`
- `styles.css`

## What this changes
The order-slip preview now reads the actual dimensions of whichever fleet image is selected and adjusts the upper image panel to that image's natural aspect ratio. The image fills the panel without being cropped. This applies to all seven vehicles, not only the V8 and Acura.

When the selection is cleared, the panel returns to its default empty state. The image labels and dark overlay remain in place. The fleet selection cards are not changed.

## Apply and test
1. Replace the root `script.js` and `styles.css` with these files.
2. Commit and push to the Cloudflare Pages deployment branch.
3. After deployment, select each vehicle on Find Your Ride and confirm the full car is visible in the order-slip image area.

The modified JavaScript passed `node --check`.
