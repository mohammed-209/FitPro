package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "goals")
public class Goal extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "target_value")
    private Double targetValue;

    @Column(name = "current_value")
    private Double currentValue;

    @Column(name = "goal_type")
    private String goalType;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "target_date")
    private LocalDateTime targetDate;

    private Boolean completed = false;
} 