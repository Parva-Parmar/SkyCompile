package com.skycompile.backend_spring.controllers;

import com.skycompile.backend_spring.entities.Project;
import com.skycompile.backend_spring.entities.ProjectMember;
import com.skycompile.backend_spring.entities.ProjectRole;
import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.repositories.ProjectMemberRepository;
import com.skycompile.backend_spring.repositories.ProjectRepository;
import com.skycompile.backend_spring.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/permissions")

@RequiredArgsConstructor
public class ProjectPermissionController {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProjectPermissions(
            @PathVariable UUID projectId,
            @RequestParam String action,
            @RequestHeader("X-User-ID") String userId) {
        
        try {
            // Find user by ID
            User user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Get project
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            
            // Check if user is owner
            boolean isOwner = project.getOwner().getId().equals(user.getId());
            
            // Check project membership
            Optional<ProjectMember> memberOpt = projectMemberRepository.findByProjectAndUser(project, user);
            ProjectRole userRole = ProjectRole.VIEWER; // Default role
            
            if (isOwner) {
                userRole = ProjectRole.OWNER;
            } else if (memberOpt.isPresent()) {
                userRole = memberOpt.get().getRole();
            } else {
                // User is not a member, no permissions
                return ResponseEntity.ok(Map.of(
                    "canCreateFiles", false,
                    "canDeleteFiles", false,
                    "canEditFiles", false,
                    "role", "NONE"
                ));
            }
            
            // Determine permissions based on role
            Map<String, Object> permissions = new HashMap<>();
            
            switch (userRole) {
                case OWNER:
                    permissions.put("canCreateFiles", true);
                    permissions.put("canDeleteFiles", true);
                    permissions.put("canEditFiles", true);
                    break;
                case EDITOR:
                    permissions.put("canCreateFiles", true);
                    permissions.put("canDeleteFiles", true);
                    permissions.put("canEditFiles", true);
                    break;
                case VIEWER:
                    permissions.put("canCreateFiles", false);
                    permissions.put("canDeleteFiles", false);
                    permissions.put("canEditFiles", false);
                    break;
            }
            
            permissions.put("role", userRole.toString());
            
            return ResponseEntity.ok(permissions);
            
        } catch (Exception e) {
            // Return no permissions on any error
            return ResponseEntity.ok(Map.of(
                "canCreateFiles", false,
                "canDeleteFiles", false,
                "canEditFiles", false,
                "role", "NONE"
            ));
        }
    }
}
