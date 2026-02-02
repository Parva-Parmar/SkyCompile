package com.skycompile.backend_spring;

import com.skycompile.backend_spring.repositories.ProjectRepository;
import com.skycompile.backend_spring.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendSpringApplication.class, args);
	}

	@Bean
	CommandLineRunner start(UserRepository userRepository, ProjectRepository projectRepository) {
		return args -> {
			System.out.println("-- DB connection Sanity Check -- ");
			System.out.println("Total Users in DB: " + userRepository.count());
			System.out.println("Total Projects in DB: " + projectRepository.count());
			System.out.println("--------------------------------");
		};
	}
}
