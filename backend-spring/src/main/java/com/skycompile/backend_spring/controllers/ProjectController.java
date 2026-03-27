package com.skycompile.backend_spring.controllers;

import com.skycompile.backend_spring.dto.ProjectRequest;
import com.skycompile.backend_spring.entities.Project;
import com.skycompile.backend_spring.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/projects")

public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest request) {
        try {
            Project project = projectService.createProject(request.getName());
            return new ResponseEntity<>(project, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUserProjects() {
        try {
            List<Project> projects = projectService.getUserProjects();
            List<Map<String, Object>> mapped = projects.stream().map(p -> {
                Map<String, Object> projectMap = new java.util.HashMap<>();
                projectMap.put("id", p.getId());
                projectMap.put("name", p.getName());
                projectMap.put("created_at", p.getCreatedAt() != null ? p.getCreatedAt().toString() : "");
                
                // Add owner information
                if (p.getOwner() != null) {
                    Map<String, Object> ownerMap = new java.util.HashMap<>();
                    ownerMap.put("id", p.getOwner().getId());
                    ownerMap.put("firstname", p.getOwner().getFirstname());
                    ownerMap.put("lastname", p.getOwner().getLastname());
                    ownerMap.put("email", p.getOwner().getEmail());
                    ownerMap.put("name", p.getOwner().getFirstname() + " " + p.getOwner().getLastname());
                    projectMap.put("owner", ownerMap);
                }
                
                return projectMap;
            }).collect(Collectors.toList());
            return new ResponseEntity<>(mapped, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable UUID id) {
        try {
            projectService.deleteProject(id);
            return new ResponseEntity<>("Project deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
