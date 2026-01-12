import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  listProjects,
  createProject,
  deleteProject,
} from "../controllers/project.controller";

const router = Router();

router.get("/", authMiddleware, listProjects);
router.post("/", authMiddleware, createProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
