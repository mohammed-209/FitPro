package com.fitpro.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.fitpro.repositories.UserRepository;
import com.fitpro.models.User;

@RestController
@RequestMapping("/test")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public String test() {
        return "Backend is working!";
    }

    @GetMapping("/users")
    public String checkUsers() {
        long count = userRepository.count();
        return "Number of users in database: " + count;
    }
} 