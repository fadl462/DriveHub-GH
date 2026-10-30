DriveHub GH AI Partner — Answer-First & Quick Referral Upgrade

Files to upload/replace at the matching paths in the repository:
- functions/api/chat.js
- script.js

What changed:
- Updated the AI's verified knowledge to include all seven current vehicles, including Acura MDX, and the published starting prices.
- Added answer-first behaviour for basic questions and quick referrals for reviews, review submission, fleet browsing, and booking/enquiry.
- Added a review-score response based on the current website snapshot (5.0/5.0 from 9 reviews). This is explicitly treated as a snapshot, not a live database lookup.
- Added a prominent review page referral instead of reproducing reviews in chat.
- Added Acura MDX to the vehicle-specific enquiry action list.
- Updated the stale “six vehicles” wording in the AI Partner welcome/fallback copy.

Validation performed:
- `node --check functions/api/chat.js` passed.
- `node --check script.js` passed.

Deployment note:
This ZIP contains updated source files only. It has not been deployed to Cloudflare Pages; upload/replace these files in the repository and deploy for the live site to change. Verify prices and review count against the current published data before deployment if those figures have changed.
