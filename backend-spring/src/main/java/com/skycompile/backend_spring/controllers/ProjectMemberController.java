package com.skycompile.backend_spring.controllers;

import com.skycompile.backend_spring.dto.ProjectMemberRequest;
import com.skycompile.backend_spring.entities.ProjectMember;
import com.skycompile.backend_spring.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/members")

public class ProjectMemberController {

    private final ProjectService projectService;

    @Autowired
    public ProjectMemberController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectMember> addMember(@PathVariable UUID projectId, @RequestBody ProjectMemberRequest request) {
        try {
            ProjectMember member = projectService.addMember(projectId, request.getEmail(), request.getRole());
            return new ResponseEntity<>(member, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ProjectMember>> getMembers(@PathVariable UUID projectId) {
        try {
            List<ProjectMember> members = projectService.getProjectMembers(projectId);
            return new ResponseEntity<>(members, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> removeMember(@PathVariable UUID projectId, @PathVariable UUID userId) {
        try {
            projectService.removeMember(projectId, userId);
            return new ResponseEntity<>("Member removed successfully", HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
