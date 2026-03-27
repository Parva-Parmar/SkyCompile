package com.skycompile.backend_spring.repositories;

import com.skycompile.backend_spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    // Add this method to find a user by their email
    Optional<User> findByEmail(String email);
    
    // Search users by email, firstname, or lastname (case-insensitive)
    List<User> findByEmailContainingIgnoreCaseOrFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(String email, String firstname, String lastname);
    
    // Alternative search method with @Query for better performance
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.firstname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.lastname) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
}