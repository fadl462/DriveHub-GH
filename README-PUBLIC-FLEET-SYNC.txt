DriveHub GH — Public Fleet → Command Centre Sync

FILE TO UPLOAD
functions/command/api/vehicles.js

WHAT THIS CHANGE DOES
- When an authorised Command Centre user loads the fleet list, the API synchronises the seven public catalogue models into D1 if they are not already present: Toyota Prado, Mitsubishi Outlander, Toyota RAV4, Hyundai Santa Fe, Honda CR-V, Toyota Land Cruiser V8 and Acura MDX.
- It uses the starting prices shown on the public fleet page: GHS 1,500; 800; 800; 800; 1,000; 2,000; and 1,000 per day respectively.
- It does not invent registration numbers.
- Existing vehicle status, registration and service dates are preserved by the sync. Starting prices are aligned to the public catalogue.
- Repeated reads are idempotent: it will not create another row for a model already present.
- Adding a vehicle through the Command Centre updates an existing same-name vehicle rather than creating a duplicate.

INSTALLATION
1. In the GitHub repository fadl462/DriveHub-GH, replace functions/command/api/vehicles.js with the file at that exact path in this ZIP.
2. Commit the change and wait for Cloudflare Pages to deploy.
3. Sign in to DriveHub Command, open Fleet, and refresh. The public catalogue models should appear in the D1-backed list automatically.
4. Check each model's daily rate and status before using it operationally.

IMPORTANT LIMITATION
This is a safe first integration step for syncing the known public catalogue into the Command Centre. The public pages still contain their own presentation markup, so adding a brand-new model or changing the public starting-price list still requires updating the PUBLIC_FLEET list in this API file as well. For a true single source of truth, the next phase should move public Fleet and Find Your Ride rendering to a shared public catalogue API backed by the same central data. This package does not alter the public site's design or its current fleet display.

DATABASE ASSUMPTIONS
- D1 binding is named DB.
- vehicles has columns id, name, registration_number, daily_rate_minor, status, service_due_on, notes, created_at and updated_at.
- daily_rate_minor stores GHS in pesewas (for example GHS 1,500/day = 150000).

No live deployment has been performed by this package. Verify the deployment and D1 results after upload.
