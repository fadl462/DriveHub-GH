DriveHub GH — AI Partner build fix

Replace the existing file in your GitHub repository at:
functions/api/chat.js

This version keeps the pickup-location guidance INSIDE the JavaScript system prompt. The failed version placed the heading “PICKUP AND DELIVERY — VERIFIED BUSINESS INFORMATION” outside the template string, causing the Cloudflare Pages build error “Expected ";" but found "AND".”

Steps:
1. Open the DriveHub-GH GitHub repository.
2. Open functions > api > chat.js.
3. Edit the file and replace its contents with the chat.js included in this ZIP.
4. Commit the change to main.
5. Check the Cloudflare Pages deployment.

This ZIP contains only the corrected API file and this note. It does not itself deploy the site or change the live database.
