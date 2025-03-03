package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(unique = true, nullable = false)
    private String username;

    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    // Profile fields
    private String age;
    private String weight;
    private String height;
    private String gender;
    private String fitnessLevel;
    private String fitnessGoals;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 