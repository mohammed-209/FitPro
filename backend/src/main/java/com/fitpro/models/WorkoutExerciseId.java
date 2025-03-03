package com.fitpro.models;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class WorkoutExerciseId implements Serializable {
    private UUID workoutId;
    private UUID exerciseId;
} 