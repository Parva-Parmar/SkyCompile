package com.skycompile.backend_spring.dto;

import com.skycompile.backend_spring.entities.ProjectRole;
import lombok.Data;

import java.util.UUID;

@Data
public class ProjectMemberRequest {
    private String email;
    private ProjectRole role;
}
