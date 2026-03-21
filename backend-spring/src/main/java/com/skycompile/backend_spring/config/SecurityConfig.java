package com.skycompile.backend_spring.config;

import com.skycompile.backend_spring.filters.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor // Added this to auto-inject the filter
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter; // Inject your new filter

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for Phase 1 testing
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Force stateless REST API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/landing").permitAll() // Allow the health check
                        .anyRequest().authenticated() // Keep everything else locked
                )
                // Add our JWT filter right before Spring's default login filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}