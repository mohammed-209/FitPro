package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "workout_exercises")
public class WorkoutExercise {
    @EmbeddedId
    private WorkoutExerciseId id;

    @ManyToOne
    @MapsId("workoutId")
    @JoinColumn(name = "workout_id")
    private Workout workout;

    @ManyToOne
    @MapsId("exerciseId")
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    private Integer sets;
    private Integer reps;
    private Double weight;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name = "order_in_workout")
    private Integer orderInWorkout;
} 