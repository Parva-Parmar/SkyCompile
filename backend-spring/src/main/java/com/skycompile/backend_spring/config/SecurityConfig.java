package com.skycompile.backend_spring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for Phase 1 testing
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/landing").permitAll() // Allow the health check
                        .anyRequest().authenticated() // Keep everything else locked
                );
        return http.build();
    }
}