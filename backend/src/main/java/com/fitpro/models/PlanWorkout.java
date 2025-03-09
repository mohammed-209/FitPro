package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.UUID;

@Data
@Entity
@Table(name = "plan_workouts")
@NoArgsConstructor
@AllArgsConstructor
public class PlanWorkout {
    @EmbeddedId
    private PlanWorkoutId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("planId")
    @JoinColumn(name = "plan_id")
    private WorkoutPlan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("workoutId")
    @JoinColumn(name = "workout_id")
    private Workout workout;

    @Column(name = "week_number")
    private Integer weekNumber;

    @Column(name = "day_number")
    private Integer dayNumber;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlanWorkoutId implements java.io.Serializable {
        @Column(name = "plan_id")
        private UUID planId;

        @Column(name = "workout_id")
        private UUID workoutId;
    }
} 