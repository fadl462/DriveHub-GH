DriveHub GH — Corrected Navigation Order

The previous navigation patch was too aggressive. This corrected patch reorders only the four links the user specified, preserving the DriveHub Command and Find your ride controls in their original markup and positions.

Main navigation order: Our fleet → How it works → AI Partner → The experience.
The separate Command Centre and Find your ride buttons are preserved as-is.

Only changed HTML files are included. Replace these at the same paths in the GitHub repository, commit and push, then wait for Cloudflare Pages to deploy. This ZIP does not deploy changes automatically.