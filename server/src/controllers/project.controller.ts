import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  fetchProjects,
  addProject,
  removeProject,
} from "../services/project.service";

export const listProjects = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await fetchProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    console.error("❌ LIST PROJECTS ERROR:", err);
    res.status(500).json({ message: "Failed to load projects" });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await addProject(req.user.id, name);
    res.status(201).json(project);
  } catch (err) {
    console.error("❌ CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projectId = req.params.id;

    await removeProject(req.user.id, projectId);
    res.status(204).send();
  } catch (err) {
    console.error("❌ DELETE PROJECT ERROR:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
