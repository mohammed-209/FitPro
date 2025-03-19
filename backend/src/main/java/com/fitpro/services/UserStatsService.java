package com.fitpro.services;

import com.fitpro.models.User;
import com.fitpro.models.UserStats;
import com.fitpro.repositories.UserStatsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserStatsService {
    private static final Logger logger = LoggerFactory.getLogger(UserStatsService.class);
    
    private final UserStatsRepository userStatsRepository;

    public UserStatsService(UserStatsRepository userStatsRepository) {
        this.userStatsRepository = userStatsRepository;
    }

    /**
     * Record new stats for a user
     */
    public UserStats recordStats(User user, Double weight, Double height, Double bodyFatPercentage, LocalDateTime measurementDate) {
        logger.debug("Recording new stats for user: {}", user.getEmail());
        
        UserStats stats = new UserStats();
        stats.setUser(user);
        stats.setWeight(weight);
        stats.setHeight(height);
        stats.setBodyFatPercentage(bodyFatPercentage);
        if (measurementDate != null) {
            stats.setMeasurementDate(measurementDate);
        }
        
        return userStatsRepository.save(stats);
    }

    /**
     * Get user's latest stats
     */
    public Optional<UserStats> getLatestStats(User user) {
        logger.debug("Fetching latest stats for user: {}", user.getEmail());
        return userStatsRepository.findFirstByUserOrderByMeasurementDateDesc(user);
    }

    /**
     * Get user's stats history
     */
    public List<UserStats> getStatsHistory(User user) {
        logger.debug("Fetching stats history for user: {}", user.getEmail());
        return userStatsRepository.findByUserOrderByMeasurementDateDesc(user);
    }

    /**
     * Get user's stats for a specific date range
     */
    public List<UserStats> getStatsForDateRange(User user, LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("Fetching stats for user: {} between {} and {}", user.getEmail(), startDate, endDate);
        return userStatsRepository.findByUserAndMeasurementDateBetweenOrderByMeasurementDateDesc(
            user, startDate, endDate
        );
    }

    /**
     * Get user's weight progress
     */
    public List<UserStats> getWeightProgress(User user) {
        logger.debug("Fetching weight progress for user: {}", user.getEmail());
        return userStatsRepository.findUserWeightProgress(user);
    }

    /**
     * Get user's body fat percentage progress
     */
    public List<UserStats> getBodyFatProgress(User user) {
        logger.debug("Fetching body fat progress for user: {}", user.getEmail());
        return userStatsRepository.findUserBodyFatProgress(user);
    }

    /**
     * Calculate BMI for given stats
     */
    public double calculateBMI(UserStats stats) {
        if (stats.getWeight() == null || stats.getHeight() == null || stats.getHeight() == 0) {
            throw new IllegalArgumentException("Weight and height must be present and height must not be zero");
        }
        // BMI = weight(kg) / (height(m))²
        double heightInMeters = stats.getHeight() / 100; // Convert cm to m
        return stats.getWeight() / (heightInMeters * heightInMeters);
    }

    /**
     * Delete stats entry
     */
    public void deleteStats(UserStats stats) {
        logger.debug("Deleting stats entry with ID: {}", stats.getId());
        userStatsRepository.delete(stats);
    }
} 