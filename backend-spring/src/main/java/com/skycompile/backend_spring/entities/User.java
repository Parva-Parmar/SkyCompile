package com.skycompile.backend_spring.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(unique = true,nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at",updatable = false)
    private LocalDateTime createdAt;
    
    public User() {
        System.out.println("DEBUG: User() constructor called - firstname='" + this.firstname + "', lastname='" + this.lastname + "'");
    }
}
