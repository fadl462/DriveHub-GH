DRIVEHUB GH — AI PARTNER LIVE REVIEW DATA FIX

What this fixes
- Removes the hard-coded claim that the site has 5.0/5.0 from 9 reviews.
- Queries the existing D1 `reviews` table on every AI chat request.
- Counts only approved reviews with public review text, matching the public reviews API.
- Calculates the current average rating and supplies it to the AI for the current answer.
- If D1 is unavailable or the query fails, instructs the AI not to invent a count or rating.

File to replace
- functions/api/chat.js

Deploy
1. Replace the file at the exact path above in the connected GitHub repository.
2. Commit and push to the production branch.
3. Wait for Cloudflare Pages deployment to complete.
4. Verify that the production Pages project has its existing D1 binding named `DB` and Workers AI binding named `AI`.
5. Hard-refresh /faqs and ask: “How many approved reviews do you currently have, and what is the average rating?”

Important limitations
- This makes approved review counts/ratings current automatically from D1. It does NOT automatically discover every change made anywhere on the website or make rental availability live.
- Fleet, rates, rental policies, and booking rules still need a reliable source of truth or deliberate updates. Live availability should not be claimed unless an availability system is connected.
- This ZIP only prepares the code; it does not deploy it or modify the Cloudflare database.
