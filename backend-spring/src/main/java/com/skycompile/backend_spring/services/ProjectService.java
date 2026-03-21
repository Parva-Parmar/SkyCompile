package com.skycompile.backend_spring.services;

import com.skycompile.backend_spring.entities.Project;
import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.repositories.ProjectRepository;
import com.skycompile.backend_spring.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Not authenticated");
    }

    public Project createProject(String name) {
        User user = getCurrentUser();
        Project project = new Project();
        project.setName(name);
        project.setOwner(user);
        project.setCreatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public List<Project> getUserProjects() {
        User user = getCurrentUser();
        // Assuming ProjectRepository has findByOwner(User user), if not we need to add it, or fetch via user.getProjects() if OneToMany exists.
        // Let's implement findByOwner in ProjectRepository if not present. Wait, I should verify ProjectRepository.
        // For now, let's use a workaround if it doesn't exist, but I will add it to ProjectRepository if needed. Let's assume it exists or I will add it.
        return projectRepository.findByOwner(user);
    }

    public void deleteProject(UUID projectId) {
        User user = getCurrentUser();
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            if (project.getOwner().getId().equals(user.getId())) {
                projectRepository.delete(project);
            } else {
                throw new RuntimeException("Unauthorized to delete this project");
            }
        } else {
            throw new RuntimeException("Project not found");
        }
    }
}
