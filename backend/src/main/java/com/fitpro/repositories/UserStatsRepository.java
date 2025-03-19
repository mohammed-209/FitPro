package com.fitpro.repositories;

import com.fitpro.models.UserStats;
import com.fitpro.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, UUID> {
    // Find latest stats for a user
    Optional<UserStats> findFirstByUserOrderByMeasurementDateDesc(User user);
    
    // Find all stats for a user ordered by date
    List<UserStats> findByUserOrderByMeasurementDateDesc(User user);
    
    // Find stats within a date range
    List<UserStats> findByUserAndMeasurementDateBetweenOrderByMeasurementDateDesc(
        User user, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
    
    // Find stats by user and specific measurement date
    Optional<UserStats> findByUserAndMeasurementDate(User user, LocalDateTime measurementDate);
    
    // Custom query to get user's progress (weight change) over time
    @Query("SELECT us FROM UserStats us WHERE us.user = :user AND us.weight IS NOT NULL ORDER BY us.measurementDate DESC")
    List<UserStats> findUserWeightProgress(@Param("user") User user);
    
    // Custom query to get user's body fat percentage progress
    @Query("SELECT us FROM UserStats us WHERE us.user = :user AND us.bodyFatPercentage IS NOT NULL ORDER BY us.measurementDate DESC")
    List<UserStats> findUserBodyFatProgress(@Param("user") User user);
} 