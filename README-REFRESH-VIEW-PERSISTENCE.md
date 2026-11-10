# DriveHub GH — Command Centre refresh persistence fix

## Updated files
- `command/index.html`
- `command/app.js`
- `functions/command/api/rentals.js` (retained from the previous rental-deletion update so this ZIP can be applied as one coherent latest patch)

## Fix
- The Command Centre saves the last active section in session storage whenever a section is opened.
- On reload, it restores the URL hash first (for example `#rentals`, `#invoices`, `#payments`), and uses the saved session section as a fallback.
- Hash values are decoded and normalized before matching supported sections.
- The app script URL has a new version token to force browsers/Cloudflare edge caches to fetch the corrected JavaScript.

## Install
Replace the files at the exact paths above, then deploy the updated project to Cloudflare Pages.

## Test
1. Open `/command/`.
2. Select Rentals (or another section).
3. Refresh the browser.
4. Confirm the same section remains open.
5. Navigate to another section and refresh again.

This is a code patch only. It has not been deployed to or tested against the live Cloudflare Pages site.
