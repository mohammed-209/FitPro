package com.fitpro.exceptions;

public class AuthException extends RuntimeException {
    private final String code;

    public AuthException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static AuthException emailExists() {
        return new AuthException("Email already exists", "EMAIL_EXISTS");
    }

    public static AuthException invalidCredentials() {
        return new AuthException("Invalid email or password", "INVALID_CREDENTIALS");
    }

    public static AuthException userNotFound() {
        return new AuthException("User not found", "USER_NOT_FOUND");
    }
} 