DriveHub GH — AI Partner Quick Referral Update

Changed files only:
- functions/api/chat.js
- script.js

What this update does:
- Review/testimonial requests get a concise reply and a direct link to /experience instead of dumping review text into chat.
- Adds Acura MDX to the vehicle enquiry quick-link list.
- Updates the AI system knowledge to include all seven fleet models and the published starting prices.
- Encourages direct links to purpose-built pages instead of long unstructured responses.

Upload both files to the same paths in the website repository, replacing the existing files, then deploy via Cloudflare Pages. Do not upload the files into the root as flat files; preserve the functions/api/chat.js path.

Validation: node --check passed for both JavaScript files. This ZIP has not been deployed to the live website.
