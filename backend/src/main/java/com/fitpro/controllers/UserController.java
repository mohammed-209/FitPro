package com.fitpro.controllers;

import com.fitpro.dto.UserProfileRequest;
import com.fitpro.models.User;
import com.fitpro.repositories.UserRepository;
import com.fitpro.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UserProfileRequest profileRequest,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Update user profile
        user.setAge(profileRequest.getAge());
        user.setWeight(profileRequest.getWeight());
        user.setHeight(profileRequest.getHeight());
        user.setGender(profileRequest.getGender());
        user.setFitnessLevel(profileRequest.getFitnessLevel());
        user.setFitnessGoals(profileRequest.getFitnessGoals());

        // Save the updated user
        userRepository.save(user);

        // Create response with profile data
        Map<String, Object> response = new HashMap<>();
        Map<String, String> profile = new HashMap<>();
        
        profile.put("age", user.getAge());
        profile.put("weight", user.getWeight());
        profile.put("height", user.getHeight());
        profile.put("gender", user.getGender());
        profile.put("fitnessLevel", user.getFitnessLevel());
        profile.put("fitnessGoals", user.getFitnessGoals());

        response.put("profile", profile);
        
        return ResponseEntity.ok(response);
    }
} 