package com.fitpro.dto;

import lombok.Data;
import java.util.List;

@Data
public class GenerateWorkoutRequest {
    private String difficultyLevel;
    private List<String> muscleGroups;
    private Integer duration;
    private String equipment;
} 