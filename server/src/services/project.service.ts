import {
  getProjectsByUser,
  insertProject,
  deleteProjectById,
} from "../models/project.model";

export const fetchProjects = (userId: string) =>
  getProjectsByUser(userId);

export const addProject = (userId: string, name: string) =>
  insertProject(userId, name);

export const removeProject = (userId: string, projectId: number) =>
  deleteProjectById(userId, projectId);
