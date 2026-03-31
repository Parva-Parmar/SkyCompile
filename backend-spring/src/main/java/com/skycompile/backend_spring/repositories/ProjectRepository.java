package com.skycompile.backend_spring.repositories;

import com.skycompile.backend_spring.entities.Project;
import com.skycompile.backend_spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByOwner(User owner);
}
