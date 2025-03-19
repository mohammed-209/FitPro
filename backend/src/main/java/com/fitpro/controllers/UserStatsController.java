package com.fitpro.controllers;

import com.fitpro.dto.StatsRequestDTO;
import com.fitpro.models.User;
import com.fitpro.models.UserStats;
import com.fitpro.security.CustomUserDetails;
import com.fitpro.services.UserStatsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class UserStatsController {
    private static final Logger logger = LoggerFactory.getLogger(UserStatsController.class);
    
    private final UserStatsService userStatsService;
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_DATE_TIME;

    public UserStatsController(UserStatsService userStatsService) {
        this.userStatsService = userStatsService;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUser();
    }

    @PostMapping
    public ResponseEntity<?> recordStats(@RequestBody StatsRequestDTO statsData) {
        try {
            User currentUser = getCurrentUser();
            
            // Convert ZonedDateTime to LocalDateTime if it exists
            LocalDateTime measurementDate = null;
            if (statsData.getMeasurementDate() != null) {
                measurementDate = statsData.getMeasurementDate().toLocalDateTime();
            }
            
            UserStats stats = userStatsService.recordStats(
                currentUser,
                statsData.getWeight(),
                statsData.getHeight(),
                statsData.getBodyFatPercentage(),
                measurementDate
            );

            Map<String, Object> response = new HashMap<>();
            response.put("id", stats.getId());
            response.put("weight", stats.getWeight());
            response.put("height", stats.getHeight());
            response.put("bodyFatPercentage", stats.getBodyFatPercentage());
            response.put("measurementDate", stats.getMeasurementDate());
            
            if (stats.getWeight() != null && stats.getHeight() != null) {
                response.put("bmi", userStatsService.calculateBMI(stats));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error recording stats", e);
            return ResponseEntity.badRequest().body("Error recording stats: " + e.getMessage());
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestStats() {
        try {
            User currentUser = getCurrentUser();
            return userStatsService.getLatestStats(currentUser)
                .map(stats -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("weight", stats.getWeight());
                    response.put("height", stats.getHeight());
                    response.put("bodyFatPercentage", stats.getBodyFatPercentage());
                    response.put("measurementDate", stats.getMeasurementDate());
                    
                    if (stats.getWeight() != null && stats.getHeight() != null) {
                        response.put("bmi", userStatsService.calculateBMI(stats));
                    }
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching latest stats", e);
            return ResponseEntity.badRequest().body("Error fetching latest stats: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getStatsHistory() {
        try {
            User currentUser = getCurrentUser();
            List<UserStats> history = userStatsService.getStatsHistory(currentUser);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            logger.error("Error fetching stats history", e);
            return ResponseEntity.badRequest().body("Error fetching stats history: " + e.getMessage());
        }
    }

    @GetMapping("/range")
    public ResponseEntity<?> getStatsForDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        try {
            User currentUser = getCurrentUser();
            List<UserStats> stats = userStatsService.getStatsForDateRange(currentUser, startDate, endDate);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching stats for date range", e);
            return ResponseEntity.badRequest().body("Error fetching stats for date range: " + e.getMessage());
        }
    }

    @GetMapping("/progress/weight")
    public ResponseEntity<?> getWeightProgress() {
        try {
            User currentUser = getCurrentUser();
            List<UserStats> progress = userStatsService.getWeightProgress(currentUser);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error fetching weight progress", e);
            return ResponseEntity.badRequest().body("Error fetching weight progress: " + e.getMessage());
        }
    }

    @GetMapping("/progress/bodyfat")
    public ResponseEntity<?> getBodyFatProgress() {
        try {
            User currentUser = getCurrentUser();
            List<UserStats> progress = userStatsService.getBodyFatProgress(currentUser);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error fetching body fat progress", e);
            return ResponseEntity.badRequest().body("Error fetching body fat progress: " + e.getMessage());
        }
    }
} 