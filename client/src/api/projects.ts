import { getAuthRequest, postAuthRequest, deleteAuthRequest } from "./http";

export interface Project {
  id: string; // ✅ UUID = string
  name: string;
  created_at: string;
  owner?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    name: string; // Full name
  };
}

export interface ProjectMember {
  id: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  role: "OWNER" | "EDITOR" | "VIEWER";
}

export type ProjectRole = "OWNER" | "EDITOR" | "VIEWER";

export interface UserSuggestion {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

/** GET /api/v1/projects */
export const getProjects = async (): Promise<Project[]> => {
  return getAuthRequest("/projects");
};

/** POST /api/v1/projects */
export const createProject = async (name: string): Promise<Project> => {
  return postAuthRequest("/projects", { name });
};

/** DELETE /api/v1/projects/:id */
export const deleteProject = async (id: string) => {
  return deleteAuthRequest(`/projects/${id}`);
};

/** GET /api/v1/projects/:id/members */
export const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
  return getAuthRequest(`/projects/${projectId}/members`);
};

/** POST /api/v1/projects/:id/members */
export const addProjectMember = async (projectId: string, email: string, role: ProjectRole): Promise<ProjectMember> => {
  return postAuthRequest(`/projects/${projectId}/members`, { email, role });
};

/** DELETE /api/v1/projects/:id/members/:userId */
export const removeProjectMember = async (projectId: string, userId: string): Promise<void> => {
  return deleteAuthRequest(`/projects/${projectId}/members/${userId}`);
};

/** GET /api/v1/users/search?q=query */
export const searchUsers = async (query: string): Promise<UserSuggestion[]> => {
  if (!query.trim() || query.length < 2) return [];
  return getAuthRequest(`/users/search?q=${encodeURIComponent(query.trim())}`);
};
