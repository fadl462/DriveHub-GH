DriveHub GH — Find Your Ride full-width summary image fix (v3)

Files included:
- styles.css
- script.js (included unchanged so the ZIP remains a complete pair with the previous fix)

Install:
1. Replace styles.css in the root of the DriveHub-GH GitHub repository.
2. Keep script.js unchanged unless you have not yet applied the prior image fix; if so, replace it too.
3. Commit and wait for Cloudflare Pages to deploy.
4. Hard-refresh the Find Your Ride page (Ctrl+F5) and test several vehicles, including Acura MDX.

This version makes the selected vehicle image itself fill the entire summary header, removing the empty side bars. Note: a full-bleed cover crop can trim the outer edges of source photos; avoiding all cropping and filling every pixel simultaneously is not possible when source and panel aspect ratios differ.
