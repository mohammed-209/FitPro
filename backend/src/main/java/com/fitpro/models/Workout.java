package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "workouts")
public class Workout {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "workout_id")
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "difficulty_level")
    private String difficultyLevel;
    
    @Column(name = "is_ai_generated")
    private boolean isAiGenerated;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Derived field for muscle group (could be extracted from name or description)
    @Transient
    private String muscleGroup;
    
    // Helper method to derive muscle group from workout name if not set explicitly
    public String getMuscleGroup() {
        if (muscleGroup != null) {
            return muscleGroup;
        }
        
        // Try to extract from name if possible
        if (name != null) {
            String nameLower = name.toLowerCase();
            if (nameLower.contains("chest")) return "Chest";
            if (nameLower.contains("back")) return "Back";
            if (nameLower.contains("leg")) return "Legs";
            if (nameLower.contains("arm")) return "Arms";
            if (nameLower.contains("shoulder")) return "Shoulders";
            if (nameLower.contains("core") || nameLower.contains("abs")) return "Core";
            if (nameLower.contains("cardio")) return "Cardio";
            if (nameLower.contains("full body")) return "Full Body";
        }
        
        return "Other";
    }
    
    public void setMuscleGroup(String muscleGroup) {
        this.muscleGroup = muscleGroup;
    }
} 