package com.fitpro.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String age;
    private String weight;
    private String height;
    private String gender;
    private String fitnessLevel;
    private String fitnessGoals;
} 