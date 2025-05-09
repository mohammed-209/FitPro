package com.fitpro.controllers;

import com.fitpro.models.User;
import com.fitpro.models.WorkoutHistory;
import com.fitpro.security.CustomUserDetails;
import com.fitpro.services.WorkoutService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {
    private static final Logger logger = LoggerFactory.getLogger(WorkoutController.class);
    
    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    @PostMapping
    public ResponseEntity<?> saveWorkout(@RequestBody WorkoutHistory workout) {
        try {
            logger.info("Received request to save workout: {}", workout);
            User currentUser = getCurrentUser();
            logger.info("Current user: {}", currentUser.getEmail());
            
            workout.setUser(currentUser);
            
            if (workout.getWorkoutDate() == null) {
                workout.setWorkoutDate(LocalDateTime.now());
            }
            
            WorkoutHistory savedWorkout = workoutService.saveWorkout(workout);
            logger.info("Workout saved successfully with ID: {}", savedWorkout.getId());
            return ResponseEntity.ok(savedWorkout);
        } catch (Exception e) {
            logger.error("Error saving workout", e);
            return ResponseEntity.badRequest().body("Error saving workout: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getWorkoutHistory() {
        try {
            logger.info("Fetching workout history");
            User currentUser = getCurrentUser();
            List<WorkoutHistory> history = workoutService.getWorkoutHistory(currentUser);
            logger.info("Found {} workout entries", history.size());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            logger.error("Error fetching workout history", e);
            return ResponseEntity.badRequest().body("Error fetching workout history: " + e.getMessage());
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getWorkoutStats() {
        try {
            logger.info("Fetching workout stats");
            User currentUser = getCurrentUser();
            Map<String, Object> stats = workoutService.getWorkoutStats(currentUser);
            logger.info("Stats retrieved: {}", stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching workout stats", e);
            return ResponseEntity.badRequest().body("Error fetching workout stats: " + e.getMessage());
        }
    }
    
    @GetMapping("/streak")
    public ResponseEntity<?> getWorkoutStreak() {
        try {
            logger.info("Calculating workout streak");
            User currentUser = getCurrentUser();
            int streak = workoutService.calculateWorkoutStreak(currentUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("streak", streak);
            
            logger.info("Current streak: {}", streak);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error calculating workout streak", e);
            return ResponseEntity.badRequest().body("Error calculating workout streak: " + e.getMessage());
        }
    }
    
    @GetMapping("/count")
    public ResponseEntity<?> getWorkoutCount() {
        try {
            logger.info("Counting completed workouts");
            User currentUser = getCurrentUser();
            long count = workoutService.countCompletedWorkouts(currentUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            
            logger.info("Total completed workouts: {}", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error counting workouts", e);
            return ResponseEntity.badRequest().body("Error counting workouts: " + e.getMessage());
        }
    }
} 