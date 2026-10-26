DriveHub Command — Stage 15.2: Cancel Dialog Fix

CHANGED FILE
- command/app.js only

FIX
The action form uses browser-native required-field validation. That can prevent the form's submit event from firing when a required field is blank, which makes Cancel appear not to work. This patch wires the Cancel and close (×) buttons to close the dialog directly, even when required fields are empty.

PRESERVATION
This ZIP includes only command/app.js plus this note. It preserves the customer and fleet dropdown integration from Stage 15.1. It does not replace the public website, index.html, styles.css, schema, migrations, or any other files.

UPLOAD
1. Extract the ZIP.
2. In the existing GitHub repository, open command/.
3. Replace only app.js with command/app.js from this ZIP.
4. Commit and wait for Cloudflare Pages to deploy.
5. Open /command/#rentals, click Add rental, leave required fields empty, and click Cancel or ×. The dialog should close without saving a rental.
