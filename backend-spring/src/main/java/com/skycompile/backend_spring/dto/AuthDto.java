package com.skycompile.backend_spring.dto;

import lombok.Builder;
import lombok.Data;

public class AuthDto {
    
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class SignupRequest {
        private String firstname;
        private String lastname;
        private String email;
        private String password;
    }

    @Data
    @Builder
    public static class AuthResponse {
        private String token;
        private UserResponse user;
    }

    @Data
    @Builder
    public static class UserResponse {
        private String id;
        private String firstname;
        private String lastname;
        private String email;
        private String created_at;
        private Integer project_count;
        private Integer friend_count;
        // Remove the redundant "name" field - frontend will concatenate
    }
}
