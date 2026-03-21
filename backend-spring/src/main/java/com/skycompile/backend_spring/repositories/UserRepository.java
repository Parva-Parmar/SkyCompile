package com.skycompile.backend_spring.repositories;

import com.skycompile.backend_spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    // Add this method to find a user by their email
    Optional<User> findByEmail(String email);
}