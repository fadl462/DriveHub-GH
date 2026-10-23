# DriveHub GH website

Responsive static website for DriveHub GH, designed around the supplied brand assets and the existing rental contact details.

## Files
- `index.html` — page structure and copy
- `styles.css` — responsive visual system and layout
- `script.js` — mobile navigation, date validation and WhatsApp enquiry form
- `assets/drivehub-logo.png` — cropped transparent logo used in the site
- Remaining files in `assets/` — supplied logo source variants retained for future use

## Preview locally
Open `index.html` in a browser. For a more realistic local preview, use VS Code with Live Server.

## Deploy
Upload the contents of this folder to a static host such as Cloudflare Pages or GitHub Pages. No build command is needed; the site is plain HTML, CSS and JavaScript.

## Before publishing
1. Confirm the fleet list and replace the illustrative vehicle-category photos with approved photos of the actual rental cars if available.
2. Confirm the contact details and pickup address.
3. The enquiry form opens WhatsApp with the request pre-filled. It does not confirm live availability or create a booking in a database.
4. The website currently uses remote Unsplash images and Google Fonts, so those visual assets require an internet connection.
