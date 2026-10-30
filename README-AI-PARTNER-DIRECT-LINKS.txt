DriveHub GH AI Partner — Direct Links in Chat

Files in this package:
- script.js
- functions/api/chat.js

What this update does:
1. Makes URLs returned in AI responses clickable without injecting model-generated HTML.
2. Adds a clear contextual referral button for review/trust questions, booking/enquiry questions, review submission, and full-fleet questions even when the model misses a marker.
3. Strengthens server instructions so relevant answers use the website's referral markers consistently.
4. Keeps existing chat persistence and other site logic from the provided current script.js.

Upload both files to the repository at the exact paths shown above, commit, and wait for Cloudflare Pages to deploy. This package has not been deployed to the live website.

Test after deployment:
- “What do previous customers say?” → answer plus “Read customer reviews on The Experience page” link.
- “What is your overall review score?” → score plus Experience page link.
- “How can I enquire about an Acura MDX?” → Find Your Ride link and Acura enquiry action.
- “Show me the full fleet” → fleet link and relevant vehicle enquiry actions.
- Ask for a review link → leave-a-review link.
