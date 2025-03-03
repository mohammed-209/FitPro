package com.fitpro.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        logger.debug("JwtTokenFilter processing request to: {}", requestURI);

        // Log all headers for debugging
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            logger.debug("Header {}: {}", headerName, request.getHeader(headerName));
        }
        
        try {
            String jwt = getJwtFromRequest(request);
            logger.debug("JWT Token found in request: {}", jwt != null ? "present" : "not present");

            if (jwt != null) {
                logger.debug("Attempting to validate token for request to: {}", requestURI);
                try {
                    if (jwtTokenProvider.validateToken(jwt)) {
                        String username = jwtTokenProvider.getUsernameFromToken(jwt);
                        logger.debug("Token is valid for user: {}", username);

                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        logger.debug("Loaded user details for: {}, authorities: {}", username, userDetails.getAuthorities());
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.debug("Successfully set authentication in SecurityContext for user: {}", username);
                    } else {
                        logger.warn("Token validation failed for request to: {}", requestURI);
                        SecurityContextHolder.clearContext();
                    }
                } catch (Exception e) {
                    logger.error("Error validating token", e);
                    SecurityContextHolder.clearContext();
                }
            } else {
                logger.debug("No JWT token found in request to: {}", requestURI);
                SecurityContextHolder.clearContext();
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
        logger.debug("Completed processing request to: {}", requestURI);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 