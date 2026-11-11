# DriveHub GH — Customer uniqueness rules

Replace these files at their existing paths:
- `command/app.js`
- `functions/command/api/customers.js`

## Behaviour after this update
- Different customers may have the same full name.
- A phone number can belong to only one active customer.
- Phone comparisons ignore spaces, punctuation and formatting; Ghana `+233` and local `0` formats are treated as equivalent.
- Existing email duplicate checking remains in the Command Centre form.
- Saving a new customer no longer silently replaces an existing customer with the same name.
- The API checks phone uniqueness too, so browser-side validation cannot be bypassed.

No existing customer records are deleted, merged, or changed.

## Deploy and test
1. Replace the two files at the paths above.
2. Commit and push to the Cloudflare Pages deployment branch.
3. Test adding a different person with an existing customer's name but a different phone number — it should save.
4. Test reusing an existing customer's phone number — it should be rejected and identify the existing customer.
5. Confirm a customer edit updates that record rather than creating another one.
