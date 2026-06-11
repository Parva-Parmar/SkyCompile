package com.skycompile.backend_spring.controllers;

import com.skycompile.backend_spring.dto.AuthDto;
import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.repositories.UserRepository;
import com.skycompile.backend_spring.services.FriendshipService;
import com.skycompile.backend_spring.services.ProjectService;
import com.skycompile.backend_spring.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping({"/api/auth", "/api/v1/auth"})
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final ProjectService projectService;
    private final FriendshipService friendshipService;
    private final com.skycompile.backend_spring.repositories.ProjectMemberRepository projectMemberRepository;
    private final com.skycompile.backend_spring.repositories.FriendshipRepository friendshipRepository;
    

    @PostMapping("/signin")
    public ResponseEntity<AuthDto.AuthResponse> authenticateUser(@RequestBody AuthDto.LoginRequest loginRequest) {
        
        // This natively throws an exception if the credentials don't match our BCrypt password hashes
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        
        // Fetch actual counts from repositories
        Integer projectCount = projectMemberRepository.findByUser(user).size();
        Integer friendCount = friendshipRepository.findByUserAndStatus(user, "accepted").size();
        
        String jwtToken = jwtUtils.generateToken(user.getEmail(), user.getId().toString());

        return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                .token(jwtToken)
                .user(AuthDto.UserResponse.builder()
                        .id(user.getId().toString())
                        .firstname(user.getFirstname())
                        .lastname(user.getLastname())
                        .email(user.getEmail())
                        .created_at(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                        .project_count(projectCount)
                        .friend_count(friendCount)
                        .build())
                .build());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody AuthDto.SignupRequest signUpRequest) {
        
        // Check if user already exists first
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "message", "Error: Email '" + signUpRequest.getEmail() + "' is already in use!",
                "suggestion", "Try logging in with your existing account or use a different email address."
            ));
        }

        User user = new User();
        
        // Use firstname and lastname directly from the request
        String firstname = signUpRequest.getFirstname();
        String lastname = signUpRequest.getLastname();
        
        System.out.println("DEBUG: Firstname from request: '" + firstname + "'");
        System.out.println("DEBUG: Lastname from request: '" + lastname + "'");
        
        // Handle empty names with defaults
        if (firstname == null || firstname.trim().isEmpty()) {
            firstname = signUpRequest.getEmail().split("@")[0];
            System.out.println("DEBUG: Using email prefix as firstname: '" + firstname + "'");
        }
        if (lastname == null || lastname.trim().isEmpty()) {
            lastname = "User";
            System.out.println("DEBUG: Using default lastname: '" + lastname + "'");
        }
        
        user.setFirstname(firstname.trim());
        user.setLastname(lastname.trim());
        
        System.out.println("DEBUG: Before save - User object: firstname='" + user.getFirstname() + "', lastname='" + user.getLastname() + "'");
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        userRepository.saveAndFlush(user);

        // Use findById to get a fresh entity instance from the persistence context
        User savedUser = userRepository.findById(user.getId()).orElseThrow();
        
        System.out.println("DEBUG: After fetch - User object: firstname='" + savedUser.getFirstname() + "', lastname='" + savedUser.getLastname() + "'");

        // Auto-login the user immediately after safe registration
        String jwtToken = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getId().toString());

        // Fetch actual counts from repositories
        Integer projectCount = projectMemberRepository.findByUser(savedUser).size();
        Integer friendCount = friendshipRepository.findByUserAndStatus(savedUser, "accepted").size();

        return ResponseEntity.ok(AuthDto.AuthResponse.builder()
                .token(jwtToken)
                .user(AuthDto.UserResponse.builder()
                        .id(savedUser.getId().toString())
                        .firstname(savedUser.getFirstname())
                        .lastname(savedUser.getLastname())
                        .email(savedUser.getEmail())
                        .created_at(savedUser.getCreatedAt() != null ? savedUser.getCreatedAt().toString() : null)
                        .project_count(projectCount)
                        .friend_count(friendCount)
                        .build())
                .build());
    }
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(org.springframework.security.core.AuthenticationException e) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                .body(java.util.Map.of("error", "Unauthorized", "message", "Invalid email or password"));
    }

    @ExceptionHandler(java.util.NoSuchElementException.class)
    public ResponseEntity<?> handleNoSuchElementException(java.util.NoSuchElementException e) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                .body(java.util.Map.of("error", "Unauthorized", "message", "User not found"));
    }
}
