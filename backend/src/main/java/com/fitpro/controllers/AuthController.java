package com.fitpro.controllers;

import com.fitpro.dto.AuthResponse;
import com.fitpro.dto.LoginRequest;
import com.fitpro.dto.SignupRequest;
import com.fitpro.services.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        logger.debug("Received signup request for email: {}", request.getEmail());
        try {
            AuthResponse response = authService.signup(request);
            logger.debug("Successfully processed signup request");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing signup request", e);
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        logger.debug("Received login request for email: {}", request.getEmail());
        try {
            AuthResponse response = authService.login(request);
            logger.debug("Successfully processed login request");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing login request", e);
            throw e;
        }
    }
} 