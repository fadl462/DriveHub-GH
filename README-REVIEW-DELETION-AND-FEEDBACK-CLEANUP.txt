DriveHub GH — Review deletion and Overview feedback cleanup

Updated files only (preserve paths):
- command/app.js
- command/styles.css
- functions/command/api/reviews.js

Changes:
1. Rejected reviews have a Delete permanently button. It is restricted to rejected reviews, requires confirmation, and is available to admin/review_moderator roles. Deletion is audited.
2. Customer improvement feedback marked Resolved is removed from the active Overview list, while its review record remains in the database and is not deleted. Change it back from Resolved to make it appear again.
3. Added clear vertical spacing between Recent rentals and Customer improvement feedback.

Deployment: Upload these files to the repository using the paths above. This package has not been deployed. The DELETE API was syntax-checked, but test in your Cloudflare environment after upload.
