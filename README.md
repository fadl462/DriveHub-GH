# DriveHub GH — Multi-Page Website

## Separate pages
- `index.html` — Home (short rental-focused landing page)
- `fleet.html` — Our Fleet
- `experience.html` — The Experience
- `how-it-works.html` — How It Works
- `faqs.html` — FAQs
- `find-your-ride.html` — Rental enquiry form

The homepage intentionally does not contain the full fleet, experience, process, or FAQ page content. Each navigation item links to its own HTML file. The header and footer navigation are available across pages.

## Deploy
Upload the **contents** of this folder to the Cloudflare Pages deployment, preserving the `assets` directory and all HTML files at the deployment root. Do not upload only `index.html`.

## Enquiry form
The form opens WhatsApp with the selected rental details prefilled. It does not check live availability or confirm a booking.
