package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user_stats")
public class UserStats extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double weight;
    private Double height;

    @Column(name = "body_fat_percentage")
    private Double bodyFatPercentage;

    @Column(name = "measurement_date")
    private LocalDateTime measurementDate;

    @PrePersist
    protected void onCreate() {
        measurementDate = LocalDateTime.now();
    }
} 