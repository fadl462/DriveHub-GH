ALTER TABLE rentals ADD COLUMN sourced_vehicle_id TEXT REFERENCES sourced_vehicles(id);
