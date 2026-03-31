package com.skycompile.backend_spring.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.skycompile.backend_spring.repositories.UserRepository;
import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.dto.AuthDto;
import com.skycompile.backend_spring.services.FriendshipService;
import com.skycompile.backend_spring.services.ProjectService;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final com.skycompile.backend_spring.repositories.FriendshipRepository friendshipRepository;
    private final com.skycompile.backend_spring.repositories.ProjectMemberRepository projectMemberRepository;

    @GetMapping("/me")
    public ResponseEntity<AuthDto.UserResponse> getCurrentUser() {
        // Grab the authentication object injected by our JwtAuthenticationFilter
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        log.debug("UserController - Email from auth: '{}'", email);

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found: " + email));

        // Fetch actual counts from repositories
        Integer projectCount = projectMemberRepository.findByUser(user).size();
        Integer friendCount = friendshipRepository.findByUserAndStatus(user, "accepted").size();

        return ResponseEntity.ok(AuthDto.UserResponse.builder()
                .id(user.getId().toString())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .created_at(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .project_count(projectCount)
                .friend_count(friendCount)
                .build());
    }
}