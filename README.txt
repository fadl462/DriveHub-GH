DriveHub GH — Experience page CTA restoration

Upload experience.html to the website root, replacing the currently deployed experience.html.

This file restores the top-right “Share your experience” button, removes its pointing-arrow icon, and keeps “Have a story to share?” on the left with “Write a review” as a separate button on the right. It retains the existing published-review API/rendering and dynamic rating calculation; it does not hard-code the 5.0/5.0 rating or replace review data.

The page continues to load the existing root-level stylesheets (styles.css, review-experience.css, review-card-hover-refinement.css, command-button.css) and existing assets. Do not upload this HTML into a nested folder.

After upload, purge Cloudflare cache or hard-refresh the page (Ctrl+Shift+R). This package has not been deployed to the live site.
