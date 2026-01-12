import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  fetchProjects,
  addProject,
  removeProject,
} from "../services/project.service";

export const listProjects = async (req: AuthRequest, res: Response) => {
  const projects = await fetchProjects(req.userId!);
  res.json(projects);
};

export const createProject = async (req: AuthRequest, res: Response) => {
  await addProject(req.userId!, req.body.name);
  res.status(201).json({ message: "Project created" });
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  await removeProject(req.userId!, Number(req.params.id));
  res.json({ message: "Project deleted" });
};
