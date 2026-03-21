package com.skycompile.backend_spring.services;

import com.skycompile.backend_spring.entities.Project;
import com.skycompile.backend_spring.entities.ProjectMember;
import com.skycompile.backend_spring.entities.ProjectRole;
import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.repositories.ProjectMemberRepository;
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
import java.util.stream.Collectors;
import java.util.ArrayList;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, ProjectMemberRepository projectMemberRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
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
        Project savedProject = projectRepository.save(project);

        ProjectMember member = new ProjectMember();
        member.setProject(savedProject);
        member.setUser(user);
        member.setRole(ProjectRole.OWNER);
        projectMemberRepository.save(member);

        log.info("[AUDIT] User {} created project '{}' ({})", user.getId(), name, savedProject.getId());

        return savedProject;
    }

    public List<Project> getUserProjects() {
        User user = getCurrentUser();
        List<Project> owned = projectRepository.findByOwner(user);
        List<Project> memberOf = projectMemberRepository.findByUser(user).stream()
                .map(ProjectMember::getProject)
                .collect(Collectors.toList());
        
        List<Project> allProjects = new ArrayList<>(owned);
        for (Project p : memberOf) {
            // Very basic uniqueness check, normally use a Set with proper equals/hashCode
            boolean exists = allProjects.stream().anyMatch(existing -> existing.getId().equals(p.getId()));
            if (!exists) {
                allProjects.add(p);
            }
        }
        return allProjects;
    }

    public void deleteProject(UUID projectId) {
        User user = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        boolean isOwner = project.getOwner().getId().equals(user.getId());
        if (!isOwner) {
            Optional<ProjectMember> member = projectMemberRepository.findByProjectAndUser(project, user);
            if (member.isPresent() && member.get().getRole() == ProjectRole.OWNER) {
                isOwner = true;
            }
        }
        
        if (isOwner) {
            log.info("[AUDIT] User {} deleted project {}", user.getId(), projectId);
            projectRepository.delete(project);
        } else {
            throw new RuntimeException("Unauthorized to delete this project");
        }
    }

    public ProjectMember addMember(UUID projectId, String email, ProjectRole role) {
        User currentUser = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        Optional<ProjectMember> currentMember = projectMemberRepository.findByProjectAndUser(project, currentUser);
        boolean canAdd = project.getOwner().getId().equals(currentUser.getId()) || 
            (currentMember.isPresent() && (currentMember.get().getRole() == ProjectRole.OWNER || currentMember.get().getRole() == ProjectRole.EDITOR));
            
        if (!canAdd) {
            throw new RuntimeException("Unauthorized to add members");
        }
        
        User userToAdd = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User to add not found"));
                
        Optional<ProjectMember> existingMember = projectMemberRepository.findByProjectAndUser(project, userToAdd);
        if (existingMember.isPresent()) {
            ProjectMember em = existingMember.get();
            em.setRole(role);
            return projectMemberRepository.save(em);
        }
        
        ProjectMember newMember = new ProjectMember();
        newMember.setProject(project);
        newMember.setUser(userToAdd);
        newMember.setRole(role);
        
        log.info("[AUDIT] User {} added user {} to project {} with role {}", currentUser.getId(), userToAdd.getId(), projectId, role);
        return projectMemberRepository.save(newMember);
    }

    public void removeMember(UUID projectId, UUID userIdToRemove) {
        User currentUser = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
                
        Optional<ProjectMember> currentMember = projectMemberRepository.findByProjectAndUser(project, currentUser);
        boolean canRemove = project.getOwner().getId().equals(currentUser.getId()) || 
            (currentMember.isPresent() && (currentMember.get().getRole() == ProjectRole.OWNER));
            
        if (!canRemove && !currentUser.getId().equals(userIdToRemove)) {
            // Users can remove themselves, or owners can remove anyone
            throw new RuntimeException("Unauthorized to remove members");
        }
        
        User userToRemove = userRepository.findById(userIdToRemove)
                .orElseThrow(() -> new RuntimeException("User to remove not found"));
                
        Optional<ProjectMember> existingMember = projectMemberRepository.findByProjectAndUser(project, userToRemove);
        existingMember.ifPresent(m -> {
            log.info("[AUDIT] User {} removed user {} from project {}", currentUser.getId(), userToRemove.getId(), projectId);
            projectMemberRepository.delete(m);
        });
    }
    
    public List<ProjectMember> getProjectMembers(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return projectMemberRepository.findByProject(project);
    }
}
