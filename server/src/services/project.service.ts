import {
  getProjectsByUser,
  insertProject,
  deleteProjectById,
} from "../models/project.model";

export const fetchProjects = (userId: string) => {
  return getProjectsByUser(userId);
};

export const addProject = async (userId: string, name: string) => {
  return insertProject(userId, name);
};

export const removeProject = (userId: string, projectId: string) => {
  return deleteProjectById(userId, projectId);
};
