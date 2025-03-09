-- Update weight column type in workout_exercises table
ALTER TABLE workout_exercises ALTER COLUMN weight TYPE FLOAT USING weight::FLOAT; 