# Stage 14.1 — Preserve Command Centre page on refresh

## Change
The Command Centre now stores the active section in the URL hash (for example, `#customers` or `#fleet`). Refreshing the browser restores that section instead of always opening Overview. Browser Back/Forward navigation between sections is also supported.

## Upload
Upload `app.js` to the existing repository `command/` folder and allow Cloudflare Pages to deploy. Do not replace any other files.

## Test
1. Open `/command/`.
2. Click Customers, Fleet, or another section.
3. Refresh the browser.
4. Confirm the same section remains open.
5. Use browser Back/Forward after navigating between sections and confirm the section follows the URL hash.
