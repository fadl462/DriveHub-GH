# DriveHub GH — Public Site Regression Fixes

This ZIP contains the **actual updated website files**, not a patch script.

## Replace these files in the repository root

- `index.html`
- `styles.css`
- `script.js`
- `functions/api/chat.js`
- `functions/api/faq-knowledge.js`

Keep the folder paths exactly as shown. Do not upload these files inside an extra nested `DriveHub-GH-main` folder.

## What was corrected

1. Moved the homepage “Share your experience” invitation out of the hero and into its own strip immediately before the booking section. This prevents the fixed-height hero from clipping it.
2. Changed the selected-vehicle image in the Find Your Ride summary to `object-fit: contain`, with centered positioning and padding, so the complete vehicle is visible.
3. Removed hard-coded “5.0/5.0 from 9 reviews” claims from the AI Partner instructions and FAQ knowledge. The AI Partner now directs visitors to the Experience page for the current published rating and reviews rather than presenting a stale snapshot.
4. Added verified How It Works and AI Partner page URLs to the AI Partner's page knowledge.
5. Updated AI Partner guidance to provide relevant supporting page links, and expanded chat link rendering so `/how-it-works` and `/faqs` are clickable.

## Upload and deploy

1. Extract this ZIP.
2. In your existing GitHub repository, replace the five files at the exact paths above.
3. Commit and push to the branch used by Cloudflare Pages (normally `main`).
4. Wait for the Cloudflare Pages deployment to complete before testing the public site.

## Verification checklist

- Homepage: “Share your experience” appears fully below the hero, above the booking panel.
- Find Your Ride: select each vehicle and confirm the entire vehicle image is visible in the summary.
- AI Partner: ask “How many reviews do you have?”, “How does booking work?”, “Where can I read reviews?”, and “Can you explain how the rental process works?”
- Confirm answers use the correct page links and do not invent a fixed review count.
- Check desktop and mobile layouts.

## Validation performed

The JavaScript files `script.js`, `functions/api/chat.js`, and `functions/api/faq-knowledge.js` passed `node --check`. The homepage markup was checked for balanced tags and the target changes were verified in the generated files.

This ZIP has not been pushed or deployed by ChatGPT. It is ready for you to upload to GitHub.
