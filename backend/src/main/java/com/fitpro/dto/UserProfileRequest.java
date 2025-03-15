package com.fitpro.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private Integer age;
    private Double weight;
    private Double height;
    private String gender;
    private String fitnessLevel;
    private String fitnessGoals;
} 