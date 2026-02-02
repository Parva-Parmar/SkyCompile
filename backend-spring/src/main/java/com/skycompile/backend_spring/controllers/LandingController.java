package com.skycompile.backend_spring.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class LandingController {
    @GetMapping("/landing")
    public ResponseEntity<Map<String, String>> getLanding() {
        Map<String, String> response = new HashMap<>();
        response.put("appName", "SkyCompile");
        response.put("tagline", "Collaborative project builder");
        response.put("status", "Backend connected successfully 🚀");
        return ResponseEntity.ok(response);
    }
}