-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    age VARCHAR(255),
    weight FLOAT,
    height FLOAT,
    gender VARCHAR(20),
    fitness_level VARCHAR(50),
    fitness_goals TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    profile_image_url VARCHAR(255)
);

-- User Stats table
CREATE TABLE IF NOT EXISTS user_stats (
    stat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    weight FLOAT,
    height FLOAT,
    body_fat_percentage FLOAT,
    measurement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    workout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20),
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    exercise_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    muscle_group VARCHAR(50),
    equipment_needed VARCHAR(100),
    difficulty_level VARCHAR(20)
);

-- Workout Exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_id UUID REFERENCES workouts(workout_id),
    exercise_id UUID REFERENCES exercises(exercise_id),
    sets INTEGER,
    reps INTEGER,
    weight FLOAT,
    rest_seconds INTEGER,
    order_in_workout INTEGER,
    PRIMARY KEY (workout_id, exercise_id)
);

-- Workout History table
CREATE TABLE IF NOT EXISTS workout_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID REFERENCES workouts(workout_id),
    user_id UUID REFERENCES users(user_id) NOT NULL,
    workout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    muscle_group VARCHAR(50),
    duration_minutes INTEGER,
    calories_burned INTEGER,
    is_completed BOOLEAN DEFAULT true
);

-- Workout History Exercises table
CREATE TABLE IF NOT EXISTS workout_history_exercises (
    history_id UUID REFERENCES workout_history(history_id),
    exercise_name VARCHAR(100),
    sets_completed INTEGER,
    PRIMARY KEY (history_id, exercise_name)
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    goal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    target_value DECIMAL(8,2),
    current_value DECIMAL(8,2),
    goal_type VARCHAR(50),
    start_date TIMESTAMP,
    target_date TIMESTAMP,
    completed BOOLEAN DEFAULT false
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    criteria TEXT,
    badge_image_url VARCHAR(255)
);

-- User Achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    user_id UUID REFERENCES users(user_id),
    achievement_id UUID REFERENCES achievements(achievement_id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

-- Social Connections table
CREATE TABLE IF NOT EXISTS social_connections (
    user_id UUID REFERENCES users(user_id),
    friend_id UUID REFERENCES users(user_id),
    status VARCHAR(20),
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id)
);