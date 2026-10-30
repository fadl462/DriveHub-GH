# DriveHub GH — Canonical Fleet Name Corrections

## Intended canonical public fleet
- Mitsubishi Outlander (Silver Metallic) — GHS 800/day
- Hyundai Santafe (Silver Metallic) — GHS 800/day
- Toyota Prado — GHS 1,500/day
- Toyota RAV4 — GHS 800/day
- Honda CR-V — GHS 1,000/day
- Toyota Land Cruiser V8 — GHS 2,000/day
- Acura MDX — GHS 1,000/day

## Files
- `functions/command/api/vehicles.js`: syncs canonical names into the Command Centre, updates starting prices, and renames one matching legacy record without changing its ID, plate, status, service date, notes, or rental references.
- `migrations/2026-10-30-canonical-fleet-names.sql`: optional SQL for renaming legacy silver-metallic labels. Inspect existing D1 rows before running it.

## Important data-safety note
The existing D1 screenshot showed both generic and silver-metallic names. They could be separate physical cars, so this package does not blindly delete either record. The API normalizes a legacy alias when no exact canonical-name record exists; it does not merge/delete records that might have rental history. After deployment, inspect Fleet and D1. If the generic record is only a duplicate and has no rentals, it can be safely reconciled separately.

## Public pages
The visible names on `fleet.html` and `find-your-ride.html` should use these exact labels:
- Replace the Outlander display name with `Mitsubishi Outlander (Silver Metallic)` and keep its query value `Mitsubishi Outlander (Silver Metallic)`.
- Replace `Hyundai Santa Fe` with `Hyundai Santafe (Silver Metallic)` and use the same exact value in its `data-ride-vehicle` / enquiry links.
- Keep the existing starting prices unchanged.

Upload `functions/command/api/vehicles.js` at the exact path, commit, and let Cloudflare Pages deploy. Apply the optional SQL only after reviewing the existing vehicle rows and any linked rentals.
