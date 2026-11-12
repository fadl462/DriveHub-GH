# DriveHub GH — Public Homepage Asset Path Fix

## File to replace
- `index.html` (repository root)

## What this fixes
The public homepage now uses root-relative paths for its local stylesheets,
JavaScript, logo, and internal page links. This prevents the browser from
looking for assets under a nested path if the homepage is reached after a
logout redirect or fallback route.

## Installation
1. Extract this ZIP.
2. Upload/replace `index.html` in the root of the `DriveHub-GH` GitHub repository.
3. Commit and push the change.
4. Wait for Cloudflare Pages to finish deploying.
5. Test the public homepage and log out of the Command Centre again.

No D1 changes are required. This package does not modify rental, invoice,
payment, staff, or authentication records.
