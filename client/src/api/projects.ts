import { getAuthRequest, postAuthRequest, deleteAuthRequest } from "./http";

export interface Project {
  id: string; // ✅ UUID = string
  name: string;
  created_at: string;
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
