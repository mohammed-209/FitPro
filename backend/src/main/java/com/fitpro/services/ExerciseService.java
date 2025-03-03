package com.fitpro.services;

import com.fitpro.models.Exercise;
import com.fitpro.repositories.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;

    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    public List<Exercise> getExercisesByMuscleGroup(String muscleGroup) {
        return exerciseRepository.findByMuscleGroup(muscleGroup);
    }

    public Exercise getExerciseById(UUID id) {
        return exerciseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }

    public Exercise createExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    public List<Exercise> getExercisesByDifficulty(String difficultyLevel) {
        return exerciseRepository.findByDifficultyLevel(difficultyLevel);
    }
} 