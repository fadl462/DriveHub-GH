# DriveHub GH public-site regression repair

This is a **patch package**, not a full website ZIP. It applies targeted changes to the current repository source while preserving the rest of the project.

## Changes
1. Moves the homepage “Share your experience” invitation below the hero, so it no longer collides with or gets clipped by the hero section.
2. Changes the selected-vehicle image in Find Your Ride to `object-fit: contain`, so the complete vehicle is visible in the journey summary.
3. Removes the AI Partner's hard-coded 5.0/5.0 from 9 reviews statement. It now directs visitors to the live Experience page for the current rating and count.
4. Adds How It Works and AI Partner URLs to the AI Partner's verified page knowledge.
5. Makes the AI Partner more deliberate about providing the relevant supporting page URL, and extends clickable local-link rendering to How It Works and AI Partner.
6. Updates the FAQ answer about review count so it does not repeat a stale number.

## Apply
1. Download and extract this ZIP.
2. Copy `apply_patch.py` into the root of the current `DriveHub-GH` repository (the folder containing `index.html`, `styles.css`, and `script.js`).
3. Run:
   `python apply_patch.py`
4. Review the changed files and the generated `.before-drivehub-fix` backups.
5. Commit and push to the repository's deployment branch. Cloudflare Pages will deploy according to its configured build/deployment settings.

The patcher stops if the expected current source snippets are missing. It does not silently overwrite a mismatched version.

## Verification after deployment
- Homepage: the review invitation appears in a separate strip between the hero and booking form, with no overlap.
- Find Your Ride: select Prado, Outlander, RAV4, Santa Fe, CR-V, V8 and Acura; the complete vehicle should remain visible in the right-hand journey summary.
- AI Partner: ask “How many reviews do you have?”, “Where can I read reviews?”, “How do I book?”, “How does the process work?”, and “Show me the fleet”. Confirm the assistant does not invent a review count and provides the appropriate working page link.
- Check mobile layout and ensure the booking form and chat remain usable.

## Important
This package has **not** been deployed. The GitHub integration allowed source inspection but rejected repository writes with HTTP 403, so no live files were changed from this chat.
