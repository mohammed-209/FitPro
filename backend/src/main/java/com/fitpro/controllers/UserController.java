package com.fitpro.controllers;

import com.fitpro.dto.UserProfileRequest;
import com.fitpro.models.User;
import com.fitpro.repositories.UserRepository;
import com.fitpro.security.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileRequest profileRequest) {
        try {
            logger.debug("Received profile update request");
            
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.error("No authenticated user found");
                return ResponseEntity.status(401).body("User not authenticated");
            }

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();
            
            logger.debug("Updating profile for user: {}", user.getEmail());

            // Update user profile
            user.setAge(profileRequest.getAge());
            user.setWeight(profileRequest.getWeight());
            user.setHeight(profileRequest.getHeight());
            user.setGender(profileRequest.getGender());
            user.setFitnessLevel(profileRequest.getFitnessLevel());
            user.setFitnessGoals(profileRequest.getFitnessGoals());

            // Save the updated user
            user = userRepository.save(user);
            logger.debug("Profile updated successfully");

            // Create response with profile data
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> profile = new HashMap<>();
            
            profile.put("age", user.getAge());
            profile.put("weight", user.getWeight());
            profile.put("height", user.getHeight());
            profile.put("gender", user.getGender());
            profile.put("fitnessLevel", user.getFitnessLevel());
            profile.put("fitnessGoals", user.getFitnessGoals());

            response.put("profile", profile);
            
            return ResponseEntity.ok(response);
        } catch (ClassCastException e) {
            logger.error("Error casting authentication principal", e);
            return ResponseEntity.status(500).body("Invalid authentication details");
        } catch (Exception e) {
            logger.error("Error updating profile", e);
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            logger.debug("Received profile get request");
            
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.error("No authenticated user found");
                return ResponseEntity.status(401).body("User not authenticated");
            }

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();
            
            logger.debug("Fetching profile for user: {}", user.getEmail());

            // Create response with profile data
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> profile = new HashMap<>();
            
            profile.put("age", user.getAge());
            profile.put("weight", user.getWeight());
            profile.put("height", user.getHeight());
            profile.put("gender", user.getGender());
            profile.put("fitnessLevel", user.getFitnessLevel());
            profile.put("fitnessGoals", user.getFitnessGoals());

            response.put("profile", profile);
            
            return ResponseEntity.ok(response);
        } catch (ClassCastException e) {
            logger.error("Error casting authentication principal", e);
            return ResponseEntity.status(500).body("Invalid authentication details");
        } catch (Exception e) {
            logger.error("Error fetching profile", e);
            return ResponseEntity.status(500).body("Error fetching profile: " + e.getMessage());
        }
    }
} 