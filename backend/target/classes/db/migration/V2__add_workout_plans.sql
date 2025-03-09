-- Workout Plans Table
CREATE TABLE workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20),
    category VARCHAR(50),
    duration_weeks INTEGER,
    workouts_per_week INTEGER,
    is_template BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plan Workouts Table (links plans to specific workouts)
CREATE TABLE plan_workouts (
    plan_id UUID REFERENCES workout_plans(id),
    workout_id UUID REFERENCES workouts(id),
    week_number INTEGER,
    day_number INTEGER,
    PRIMARY KEY (plan_id, workout_id, week_number, day_number)
);

-- Insert some default workout plan templates
INSERT INTO workout_plans (name, description, difficulty_level, category, duration_weeks, workouts_per_week, is_template)
VALUES 
    ('Beginner Strength Training', 'A foundational strength program for beginners', 'BEGINNER', 'STRENGTH', 8, 3, true),
    ('Intermediate Hypertrophy', 'Focus on muscle growth and development', 'INTERMEDIATE', 'HYPERTROPHY', 12, 4, true),
    ('Advanced Power Building', 'Combined strength and muscle building program', 'ADVANCED', 'STRENGTH', 16, 5, true),
    ('Fat Loss Kickstart', 'High-intensity program focused on fat loss', 'BEGINNER', 'FAT_LOSS', 8, 4, true),
    ('Bodyweight Basics', 'No equipment needed home workout program', 'BEGINNER', 'CALISTHENICS', 6, 3, true);

-- Create indexes for better performance
CREATE INDEX idx_workout_plans_difficulty ON workout_plans(difficulty_level);
CREATE INDEX idx_workout_plans_category ON workout_plans(category);
CREATE INDEX idx_plan_workouts_plan_id ON plan_workouts(plan_id);
CREATE INDEX idx_plan_workouts_workout_id ON plan_workouts(workout_id); 