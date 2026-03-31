package com.skycompile.backend_spring.config;

import com.skycompile.backend_spring.entities.Project;
import com.skycompile.backend_spring.entities.ProjectMember;
import com.skycompile.backend_spring.entities.ProjectRole;
import com.skycompile.backend_spring.entities.User;
import com.skycompile.backend_spring.repositories.ProjectMemberRepository;
import com.skycompile.backend_spring.repositories.ProjectRepository;
import com.skycompile.backend_spring.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping...");
            return;
        }

        System.out.println("Seeding database for the first time...");

        // Users
        User alice = new User();
        alice.setFirstname("Alice");
        alice.setLastname("Smith");
        alice.setEmail("alice@user.com");
        alice.setPassword(passwordEncoder.encode("password123"));
        alice.setCreatedAt(LocalDateTime.now());
        userRepository.save(alice);

        User bob = new User();
        bob.setFirstname("Bob");
        bob.setLastname("Jones");
        bob.setEmail("bob@user.com");
        bob.setPassword(passwordEncoder.encode("password123"));
        bob.setCreatedAt(LocalDateTime.now());
        userRepository.save(bob);

        User charlie = new User();
        charlie.setFirstname("Charlie");
        charlie.setLastname("Brown");
        charlie.setEmail("charlie@user.com");
        charlie.setPassword(passwordEncoder.encode("password123"));
        charlie.setCreatedAt(LocalDateTime.now());
        userRepository.save(charlie);

        // Projects
        Project p1 = new Project();
        p1.setName("Alice's Web App");
        p1.setOwner(alice);
        p1.setCreatedAt(LocalDateTime.now());
        projectRepository.save(p1);

        Project p2 = new Project();
        p2.setName("Bob's API Server");
        p2.setOwner(bob);
        p2.setCreatedAt(LocalDateTime.now());
        projectRepository.save(p2);

        // Project Members
        ProjectMember pm1 = new ProjectMember();
        pm1.setProject(p1);
        pm1.setUser(alice);
        pm1.setRole(ProjectRole.OWNER);
        projectMemberRepository.save(pm1);

        ProjectMember pm2 = new ProjectMember();
        pm2.setProject(p1);
        pm2.setUser(bob);
        pm2.setRole(ProjectRole.EDITOR);
        projectMemberRepository.save(pm2);

        ProjectMember pm3 = new ProjectMember();
        pm3.setProject(p2);
        pm3.setUser(bob);
        pm3.setRole(ProjectRole.OWNER);
        projectMemberRepository.save(pm3);

        ProjectMember pm4 = new ProjectMember();
        pm4.setProject(p2);
        pm4.setUser(charlie);
        pm4.setRole(ProjectRole.VIEWER);
        projectMemberRepository.save(pm4);

        System.out.println("Database seeding completed successfully!");
    }
}
