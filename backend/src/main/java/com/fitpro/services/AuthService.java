package com.fitpro.services;

import com.fitpro.dto.AuthResponse;
import com.fitpro.dto.LoginRequest;
import com.fitpro.dto.SignupRequest;
import com.fitpro.models.User;
import com.fitpro.repositories.UserRepository;
import com.fitpro.security.CustomUserDetails;
import com.fitpro.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtTokenProvider jwtTokenProvider,
                      AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtTokenProvider.generateToken(userDetails);

        return new AuthResponse(token, user.getUsername(), null);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String token = jwtTokenProvider.generateToken(userDetails);

        // Get user's profile if any fields are set
        Map<String, String> profile = null;
        if (user.getAge() != null || user.getWeight() != null || user.getHeight() != null || 
            user.getGender() != null || user.getFitnessLevel() != null || user.getFitnessGoals() != null) {
            profile = new HashMap<>();
            profile.put("age", user.getAge());
            profile.put("weight", user.getWeight());
            profile.put("height", user.getHeight());
            profile.put("gender", user.getGender());
            profile.put("fitnessLevel", user.getFitnessLevel());
            profile.put("fitnessGoals", user.getFitnessGoals());
        }

        return new AuthResponse(token, user.getUsername(), profile);
    }
} 