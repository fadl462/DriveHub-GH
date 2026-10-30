DRIVEHUB GH — AI PARTNER KNOWLEDGE UPDATE

Included file:
  functions/api/chat.js

What this update changes:
- Updates AI Partner's verified fleet list to include all seven current models, including Acura MDX.
- Adds the published starting daily rates: Prado GHS 1,500; Outlander GHS 800; RAV4 GHS 800; Santa Fe GHS 800; Honda CR-V GHS 1,000; Land Cruiser V8 GHS 2,000; Acura MDX GHS 1,000.
- Instructs the assistant to quote these only as starting rates and to have staff confirm the final rate and availability.
- When the D1 binding is available, retrieves up to 10 newest approved public reviews to give the AI Partner current, approved testimonial context. The query excludes private improvement feedback and unapproved reviews.
- Keeps the existing model, endpoint, validation, origin checks and request limits.

Upload:
1. Extract the ZIP.
2. Upload/replace functions/api/chat.js in the website repository, preserving the exact folder path.
3. Deploy the site through the existing Cloudflare Pages workflow.
4. Test /api/chat and ask the AI Partner which vehicles are available and what each starting rate is.

Important:
- This ZIP does not deploy changes itself.
- AI can only receive current approved review context if the production Pages Function has the existing D1 binding named DB and the reviews table is present.
- Rates are the current website-published starting prices, not guaranteed quotes or live availability.
