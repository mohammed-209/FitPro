package com.fitpro.models;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Data
@Entity
@Table(name = "workout_history")
public class WorkoutHistory {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "history_id")
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;
    
    @Column(name = "completed_at")
    private LocalDateTime workoutDate;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "calories_burned")
    private Integer caloriesBurned;
    
    @Transient
    private String muscleGroup;
    
    @Transient
    private boolean isCompleted = true;
    
    @Transient
    private Map<String, Integer> exercises;
    
    // Helper method to get muscle group from the workout if available
    public String getMuscleGroup() {
        return workout != null ? workout.getMuscleGroup() : muscleGroup;
    }
} 