-- DriveHub GH canonical fleet names.
-- Review duplicate rows before applying this migration. This migration only renames
-- known legacy labels; it does not delete any vehicle or alter rental relationships.
UPDATE vehicles
SET name = 'Mitsubishi Outlander (Silver Metallic)', updated_at = CURRENT_TIMESTAMP
WHERE lower(trim(name)) IN (
  lower('Mitsubishi Outlander - Silver Metallic'),
  lower('Mitsubishi Outlander (Silver Metallic)')
);

UPDATE vehicles
SET name = 'Hyundai Santafe (Silver Metallic)', updated_at = CURRENT_TIMESTAMP
WHERE lower(trim(name)) IN (
  lower('Santafe (Silver Metallic)'),
  lower('Hyundai Santa Fe (Silver Metallic)')
);

-- Do NOT automatically rename the generic 'Mitsubishi Outlander' or 'Hyundai Santa Fe'
-- rows unless you have confirmed they are the same physical vehicles. The sync API
-- will rename one legacy alias per model while preserving its ID and relationships.
