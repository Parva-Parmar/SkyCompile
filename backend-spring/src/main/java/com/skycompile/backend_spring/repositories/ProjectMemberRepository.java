package com.skycompile.backend_spring.repositories;

import com.skycompile.backend_spring.entities.Project;
import com.skycompile.backend_spring.entities.ProjectMember;
import com.skycompile.backend_spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {
    List<ProjectMember> findByUser(User user);
    List<ProjectMember> findByProject(Project project);
    Optional<ProjectMember> findByProjectAndUser(Project project, User user);
    void deleteByProjectAndUser(Project project, User user);
}
