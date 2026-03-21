package com.skycompile.backend_spring.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getCurrentUser() {
        // Grab the authentication object injected by our JwtAuthenticationFilter
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return ResponseEntity.ok(Map.of(
                "message", "You successfully accessed a protected route!",
                "userEmail", authentication.getName() // This is the email extracted from the Node.js JWT
        ));
    }
}