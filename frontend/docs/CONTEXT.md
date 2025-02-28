# Fitness App - Flow and Features

## Introduction

This document provides a structured breakdown of the fitness app's flow and features to guide developers in implementing its functionality effectively.

## Technical Stack

### Frontend
- React Native with Typescript Expo and Expo router
- UI framework is React Native Paper
- AI Processing: DeepSeek

### Backend
- Spring Boot

## User Flow

### 1. Welcome Screen
- Clean and intuitive UI displaying the app's branding
- "Sign Up" and "Login" options for user authentication

### 2. Sign-Up Process
- Email-based registration
- Direct navigation to main dashboard upon completion

### 3. Main Dashboard
Users can:
- View personal stats (weight, reps, max lifts, workout history)
- Generate workouts from saved templates
- Use AI to generate custom workouts based on fitness stats and history
- Set and track fitness goals with AI recommendations

### 4. Workout Generation
Two primary methods:
- **Pre-Saved Workouts:** Suggested pre-defined workout routines
- **AI-Generated Workouts:** Customized based on user stats and performance trends

### 5. Workout Tracking
Features include:
- Sets and Reps tracking during workout sessions
- Built-in rest timer for managing breaks between sets

### 6. Social Tab
Social engagement features:
- Challenge participation with friends
- Progress tracking and fitness competitions
- Workout challenge system

## Core Features

### 1. User Authentication
- Email-based sign-up and login
- Secure session management

### 2. Profile and Progress Tracking
Users can:
- Update personal fitness stats
- View progress over time
- Store and reference previous workouts

### 3. AI-Generated Workouts
- Workout history analysis for custom routine generation
- Adaptive programming based on progress and improvements

### 4. Workout Tracking System
- Set, rep, and weight logging
- Rest timer with notifications
- Workout history storage

### 5. Goal Setting & Recommendations
- Specific fitness goal setting (weight loss, muscle gain, endurance)
- AI-powered workout plan customization
- Progress tracking towards goals

### 6. Streaks & Achievements
- Badge and reward system for consistency
- Streak tracking for daily workout habits
- Milestone celebration system

### 7. Social Features
- Friends list and community integration
- Competitive leaderboards
- Achievement sharing feed

### Additional Considerations
- Push notification system for workouts and challenges
- Robust security measures for user data and authentication

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    profile_image_url VARCHAR(255)
);
```

### User_Stats Table
```sql
CREATE TABLE user_stats (
    stat_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    measurement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Workouts Table
```sql
CREATE TABLE workouts (
    workout_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20),
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Exercises Table
```sql
CREATE TABLE exercises (
    exercise_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    muscle_group VARCHAR(50),
    equipment_needed VARCHAR(100),
    difficulty_level VARCHAR(20)
);
```

### Workout_Exercises Table
```sql
CREATE TABLE workout_exercises (
    workout_id UUID REFERENCES workouts(workout_id),
    exercise_id UUID REFERENCES exercises(exercise_id),
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(6,2),
    rest_seconds INTEGER,
    order_in_workout INTEGER,
    PRIMARY KEY (workout_id, exercise_id)
);
```

### Workout_History Table
```sql
CREATE TABLE workout_history (
    history_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    workout_id UUID REFERENCES workouts(workout_id),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    calories_burned INTEGER
);
```

### Goals Table
```sql
CREATE TABLE goals (
    goal_id UUID PRIMARY KEY,
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
```

### Achievements Table
```sql
CREATE TABLE achievements (
    achievement_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    criteria TEXT,
    badge_image_url VARCHAR(255)
);
```

### User_Achievements Table
```sql
CREATE TABLE user_achievements (
    user_id UUID REFERENCES users(user_id),
    achievement_id UUID REFERENCES achievements(achievement_id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);
```

### Social_Connections Table
```sql
CREATE TABLE social_connections (
    user_id UUID REFERENCES users(user_id),
    friend_id UUID REFERENCES users(user_id),
    status VARCHAR(20),
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id)
);
```

## Project Structure

### Frontend (React Native)
```
frontend/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── auth/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── dashboard/
│   │   └── index.tsx
│   ├── workouts/
│   │   ├── generate.tsx
│   │   ├── history.tsx
│   │   └── active.tsx
│   └── profile/
│       └── index.tsx
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── workout/
│   │   ├── ExerciseCard.tsx
│   │   └── Timer.tsx
│   └── profile/
│       └── StatsChart.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useWorkouts.ts
│   └── useStats.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── workout.ts
├── utils/
│   ├── constants.ts
│   └── helpers.ts
└── types/
    └── index.ts
```

### Backend (Spring Boot)
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── fitnessapp/
│   │   │           ├── controllers/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── WorkoutController.java
│   │   │           │   └── UserController.java
│   │   │           ├── models/
│   │   │           │   ├── User.java
│   │   │           │   ├── Workout.java
│   │   │           │   └── Exercise.java
│   │   │           ├── repositories/
│   │   │           │   ├── UserRepository.java
│   │   │           │   └── WorkoutRepository.java
│   │   │           ├── services/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── WorkoutService.java
│   │   │           │   └── AIService.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   └── AiConfig.java
│   │   │           └── utils/
│   │   │               └── Constants.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── fitnessapp/
│                   └── services/
│                       └── WorkoutServiceTest.java
├── pom.xml
└── README.md
```

## Conclusion

This fitness app combines workout tracking, AI-powered customization, and social competition to enhance user motivation and consistency. Development should prioritize:
- Seamless workout tracking integration
- AI system adaptability
- Engaging social features
- Intuitive user experience
