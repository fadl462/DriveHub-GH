# DriveHub GH — V8 and Acura Summary Image Framing

Replace these two files at their existing repository-root paths:
- `script.js`
- `styles.css`

## What this fixes
The V8 (`1200 × 800`) and Acura MDX (`900 × 610`) source images have different aspect ratios from the other five fleet images. The summary panel was forcing them into the same fixed-height crop, cutting off parts of those vehicles.

When either of these two vehicles is selected, the page now reads the loaded image's natural dimensions and sizes the upper image panel to that exact ratio. The image then fills the panel without cropping. Selecting any of the other vehicles resets the panel to its normal layout.

The fix is limited to the Find Your Ride journey summary and does not change the fleet cards or the other five vehicles.

## Apply
Upload/replace `script.js` and `styles.css` in the repository root, commit and push to the Cloudflare Pages deployment branch, then test Toyota Land Cruiser V8 and Acura MDX. Also switch back to an Outlander or Prado to confirm the normal summary layout resets correctly.
