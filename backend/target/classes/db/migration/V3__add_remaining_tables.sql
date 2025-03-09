-- Update user_stats table
ALTER TABLE user_stats ALTER COLUMN height TYPE FLOAT USING height::FLOAT;
ALTER TABLE user_stats ALTER COLUMN weight TYPE FLOAT USING weight::FLOAT;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS body_fat_percentage FLOAT;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS measurement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Achievements Table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    criteria TEXT,
    badge_image_url VARCHAR(255)
);

-- User Achievements Table
CREATE TABLE user_achievements (
    user_id UUID REFERENCES users(id),
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

-- Goals Table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    target_value FLOAT,
    current_value FLOAT,
    goal_type VARCHAR(50),
    start_date TIMESTAMP,
    target_date TIMESTAMP,
    completed BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX idx_achievements_name ON achievements(name);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_goal_type ON goals(goal_type); 