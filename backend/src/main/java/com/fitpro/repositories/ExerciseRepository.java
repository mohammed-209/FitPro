package com.fitpro.repositories;

import com.fitpro.models.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findByMuscleGroup(String muscleGroup);
    List<Exercise> findByDifficultyLevel(String difficultyLevel);
    List<Exercise> findByEquipmentNeeded(String equipment);
} 