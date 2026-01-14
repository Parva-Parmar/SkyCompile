import { Router } from "express";
import {
  getProjectFiles,
  getFileContent,
  saveFileContent,
  createFile,
  createFolder,
} from "../controllers/files.controller";
import {
  deleteEntry,
  renameEntry,
} from "../controllers/files.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// 🔐 All file operations require authentication
router.use(authMiddleware);

// 📁 File tree
router.get(
  "/projects/:projectId/files",
  getProjectFiles
);

// 📄 File content (read)
router.get(
  "/projects/:projectId/files/content",
  getFileContent
);

// 💾 File content (write)
router.put(
  "/projects/:projectId/files/content",
  saveFileContent
);

// ➕ Create file
router.post(
  "/projects/:projectId/files",
  createFile
);

// ➕ Create folder
router.post(
  "/projects/:projectId/folders",
  createFolder
);

router.delete(
  "/projects/:projectId/files",
  deleteEntry
);

router.put(
  "/projects/:projectId/files/rename",
  renameEntry
);


export default router;
