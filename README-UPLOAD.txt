DRIVEHUB GH — FIND YOUR RIDE SUMMARY FIX

Cause:
The current Find Your Ride page contains an Acura MDX vehicle card, but script.js did not include Acura MDX in its selected-vehicle labels, image mapping, or supported URL vehicle list. When opened with ?vehicle=Acura%20MDX, the page therefore fell back to the empty-state mark (“DH.”) instead of showing the selected vehicle.

Fix:
Updated script.js to recognize Acura MDX, display its selected vehicle name and note, load assets/fleet/acura-mdx.webp in the journey summary, and recognize Acura MDX in the vehicle query string.

Upload:
1. Upload this script.js to the website root, replacing the existing script.js.
2. Confirm assets/fleet/acura-mdx.webp already exists on the website. It was included in the previously prepared Acura MDX Fleet Website update. If it is missing, upload that asset too.
3. Purge Cloudflare cache or hard-refresh with Ctrl+Shift+R.

Only script.js is included as the functional change. No page layout, fleet card, rating, or other website files are replaced.
