package com.fitpro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Map;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private Map<String, Object> profile;
} 