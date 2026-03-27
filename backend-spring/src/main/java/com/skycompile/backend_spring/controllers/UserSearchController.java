package com.skycompile.backend_spring.controllers;

import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/users")

@RequiredArgsConstructor
public class UserSearchController {

    private final UserRepository userRepository;

    @GetMapping("/search")
    public ResponseEntity<List<UserSuggestionDTO>> searchUsers(@RequestParam String q) {
        try {
            if (q == null || q.trim().length() < 2) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            String query = q.trim();
            List<User> users = userRepository.searchUsers(query);
            
            // Convert to DTOs
            List<UserSuggestionDTO> suggestions = users.stream()
                .map(user -> new UserSuggestionDTO(
                    user.getId().toString(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getEmail()
                ))
                .limit(10) // Limit to 10 suggestions
                .collect(Collectors.toList());

            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // DTO for user suggestions
    public static class UserSuggestionDTO {
        private String id;
        private String firstname;
        private String lastname;
        private String email;

        public UserSuggestionDTO(String id, String firstname, String lastname, String email) {
            this.id = id;
            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
        }

        // Getters
        public String getId() { return id; }
        public String getFirstname() { return firstname; }
        public String getLastname() { return lastname; }
        public String getEmail() { return email; }
    }
}
