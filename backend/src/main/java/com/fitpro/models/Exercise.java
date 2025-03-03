package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "exercises")
public class Exercise extends BaseEntity {
    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "muscle_group")
    private String muscleGroup;

    @Column(name = "equipment_needed")
    private String equipmentNeeded;

    @Column(name = "difficulty_level")
    private String difficultyLevel;
} 