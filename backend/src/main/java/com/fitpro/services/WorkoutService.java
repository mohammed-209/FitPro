package com.fitpro.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fitpro.models.User;
import com.fitpro.models.WorkoutHistory;
import com.fitpro.repositories.WorkoutHistoryRepository;

@Service
@Transactional
public class WorkoutService {
    private static final Logger logger = LoggerFactory.getLogger(WorkoutService.class);
    
    private final WorkoutHistoryRepository workoutHistoryRepository;

    public WorkoutService(WorkoutHistoryRepository workoutHistoryRepository) {
        this.workoutHistoryRepository = workoutHistoryRepository;
    }

    /**
     * Save a workout
     */
    public WorkoutHistory saveWorkout(WorkoutHistory workout) {
        if (workout.getWorkoutDate() == null) {
            workout.setWorkoutDate(LocalDateTime.now());
        }
        return workoutHistoryRepository.save(workout);
    }

    /**
     * Get all workouts for a user
     */
    public List<WorkoutHistory> getWorkoutHistory(User user) {
        return workoutHistoryRepository.findByUserOrderByWorkoutDateDesc(user);
    }

    /**
     * Get all workouts by user email
     */
    public List<WorkoutHistory> getWorkoutHistoryByEmail(String email) {
        return workoutHistoryRepository.findByUserEmailOrderByWorkoutDateDesc(email);
    }

    /**
     * Calculate the current workout streak
     * A streak is consecutive days with at least one completed workout
     */
    public int calculateWorkoutStreak(User user) {
        // Get all completed workouts ordered by date descending
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<WorkoutHistory> recentWorkouts = workoutHistoryRepository.findCompletedWorkoutsAfterDate(user, thirtyDaysAgo);
        
        if (recentWorkouts.isEmpty()) {
            return 0;
        }
        
        // Group workouts by date
        Map<LocalDate, Boolean> workoutDays = new HashMap<>();
        for (WorkoutHistory workout : recentWorkouts) {
            LocalDate date = workout.getWorkoutDate().toLocalDate();
            workoutDays.put(date, true);
        }
        
        // Check if there's a workout today
        LocalDate today = LocalDate.now();
        if (!workoutDays.containsKey(today)) {
            // If no workout today, check if there was one yesterday to continue the streak
            if (!workoutDays.containsKey(today.minusDays(1))) {
                // No workout yesterday, so streak might be broken
                // Find the most recent workout date
                LocalDate lastWorkoutDate = workoutDays.keySet().stream()
                    .max(LocalDate::compareTo)
                    .orElse(null);
                
                if (lastWorkoutDate == null) {
                    return 0;
                }
                
                // If the last workout was more than 1 day ago, streak is broken
                if (ChronoUnit.DAYS.between(lastWorkoutDate, today) > 1) {
                    return 0;
                }
            }
        }
        
        // Calculate streak
        int streak = 0;
        LocalDate currentDate = today;
        
        // Check if there was a workout today
        if (workoutDays.containsKey(currentDate)) {
            streak = 1;
            currentDate = currentDate.minusDays(1);
        }
        
        // Count consecutive days with workouts going backwards
        while (workoutDays.containsKey(currentDate)) {
            streak++;
            currentDate = currentDate.minusDays(1);
        }
        
        return streak;
    }
    
    /**
     * Count total completed workouts
     */
    public long countCompletedWorkouts(User user) {
        return workoutHistoryRepository.countCompletedWorkouts(user);
    }
    
    /**
     * Get workout statistics for a user
     */
    public Map<String, Object> getWorkoutStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("streak", calculateWorkoutStreak(user));
        stats.put("totalWorkouts", countCompletedWorkouts(user));
        
        // Get latest workout
        WorkoutHistory latestWorkout = workoutHistoryRepository.findFirstByUserOrderByWorkoutDateDesc(user);
        if (latestWorkout != null) {
            stats.put("lastWorkoutDate", latestWorkout.getWorkoutDate());
            stats.put("lastWorkoutMuscleGroup", latestWorkout.getMuscleGroup());
        }
        
        return stats;
    }
} 