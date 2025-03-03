package com.fitpro.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "achievements")
public class Achievement extends BaseEntity {
    @Column(nullable = false)
    private String name;

    private String description;
    private String criteria;

    @Column(name = "badge_image_url")
    private String badgeImageUrl;
} 