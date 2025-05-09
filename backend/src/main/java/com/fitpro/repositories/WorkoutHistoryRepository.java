package com.fitpro.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fitpro.models.User;
import com.fitpro.models.WorkoutHistory;

@Repository
public interface WorkoutHistoryRepository extends JpaRepository<WorkoutHistory, UUID> {
    // Find all workouts for a user
    List<WorkoutHistory> findByUserOrderByWorkoutDateDesc(User user);
    
    // Find workouts by user email
    @Query("SELECT w FROM WorkoutHistory w WHERE w.user.email = :email ORDER BY w.workoutDate DESC")
    List<WorkoutHistory> findByUserEmailOrderByWorkoutDateDesc(@Param("email") String email);
    
    // Find completed workouts in the last X days
    @Query("SELECT w FROM WorkoutHistory w WHERE w.user = :user AND w.workoutDate >= :startDate ORDER BY w.workoutDate DESC")
    List<WorkoutHistory> findCompletedWorkoutsAfterDate(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
    
    // Count total completed workouts
    @Query("SELECT COUNT(w) FROM WorkoutHistory w WHERE w.user = :user")
    long countCompletedWorkouts(@Param("user") User user);
    
    // Find workouts by date range
    List<WorkoutHistory> findByUserAndWorkoutDateBetweenOrderByWorkoutDateDesc(User user, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find latest workout
    WorkoutHistory findFirstByUserOrderByWorkoutDateDesc(User user);
} 