package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Set;

@Data
@Entity
@Table(name = "workout_plans")
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "difficulty_level")
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @Column
    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "workouts_per_week")
    private Integer workoutsPerWeek;

    @Column(name = "is_template")
    private Boolean isTemplate = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "plan")
    private Set<PlanWorkout> planWorkouts;

    public enum DifficultyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED
    }

    public enum Category {
        STRENGTH,
        HYPERTROPHY,
        CARDIO,
        FAT_LOSS,
        CALISTHENICS,
        FLEXIBILITY,
        CUSTOM
    }
} 