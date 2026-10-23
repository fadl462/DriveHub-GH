# DriveHub GH AI Concierge — Cloudflare Pages setup

This package adds real model-generated answers using Cloudflare Workers AI through a Pages Function. The model runs server-side; no model API key is placed in browser JavaScript.

## Files in this update

- `script.js` — sends chat turns to the same-origin `/api/chat` endpoint and renders replies as text (not trusted HTML).
- `functions/api/chat.js` — server-side chat endpoint, business-grounded system instructions, message-size limits and error handling.

Keep the existing `faqs.html`, `styles.css`, assets and other website pages from your previous AI Concierge upgrade. Do not replace them with files from this package unless they are explicitly included.

## Setup in Cloudflare (required once)

1. Open Cloudflare Dashboard → **Workers & Pages** → select **drivehub-gh**.
2. Open **Settings** → **Bindings** for the **Production** environment.
3. Choose **Add** → **Workers AI**.
4. Set the variable/binding name to exactly `AI` and save.
5. Commit the updated `script.js` and the new `functions/api/chat.js` file to the root of the `main` branch in the connected GitHub repository. The function must be at `functions/api/chat.js` (not nested under another folder).
6. Wait for Cloudflare Pages to finish deploying. If the binding was added after a deployment, trigger a new deployment so it becomes available to the function.

Cloudflare docs: https://developers.cloudflare.com/pages/functions/bindings/

## Test

First open `https://drivehub-gh.pages.dev/api/chat` in a browser tab. It should return JSON showing `"endpoint":"online"` and `"aiBinding":"configured"`. If `aiBinding` is `missing`, the code is deployed but Cloudflare has not attached the Workers AI binding to that environment. Add the binding as described above and redeploy.

Then open `https://drivehub-gh.pages.dev/faqs`, hard-refresh with `Ctrl + Shift + R`, then ask: **“What is the difference between an SUV and a Compact for a family trip?”**

Then ask **“How much is an SUV per day?”** The assistant should not invent a price; it should explain that the team must confirm the current rate.

If the assistant says the AI service is not configured, verify that the Pages project has a Workers AI binding named `AI` in Production and redeploy. If it reports a temporary service issue, check the deployment/function logs in Cloudflare. The chat now has a limited fleet-guidance fallback if the live AI endpoint fails; this prevents a dead-end conversation, but only the configured Workers AI model provides full generative responses.

## Cost and limits

Workers AI is usage-based and model pricing can change. The selected model is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`. Review current pricing and account limits before promoting the assistant widely: https://developers.cloudflare.com/workers-ai/platform/pricing/

This is a conversational rental guide, not a live booking system. Vehicle availability, rates and contractual rental terms remain subject to confirmation by DriveHub GH staff.
