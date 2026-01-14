import fs from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import { getProjectRoot } from "../utils/projectRoot";
import { buildFileTree } from "../utils/fileTree";

/**
 * GET /projects/:projectId/files
 * Returns file tree for a project
 */
export async function getProjectFiles(
  req: Request,
  res: Response
) {
  const { projectId } = req.params;
  const userId = req.user.id;

  const projectRoot = getProjectRoot(userId, projectId);

  const tree = await buildFileTree(projectRoot);
  return res.json(tree);
}

/**
 * GET /projects/:projectId/files/content?path=/src/index.ts
 * Returns file content
 */
export async function getFileContent(
  req: Request,
  res: Response
) {
  const { projectId } = req.params;
  const { path: filePath } = req.query as { path: string };
  const userId = req.user.id;

  const projectRoot = getProjectRoot(userId, projectId);
  const resolvedPath = path.resolve(projectRoot, "." + filePath);

  if (!resolvedPath.startsWith(projectRoot)) {
    return res.status(403).json({ error: "Access denied" });
  }

  const content = await fs.readFile(resolvedPath, "utf-8");
  return res.json({ content });
}

/**
 * PUT /projects/:projectId/files/content
 * Body: { path: string, content: string }
 */
export async function saveFileContent(
  req: Request,
  res: Response
) {
  const { projectId } = req.params;
  const { path: filePath, content } = req.body;
  const userId = req.user.id;

  const projectRoot = getProjectRoot(userId, projectId);
  const resolvedPath = path.resolve(projectRoot, "." + filePath);

  if (!resolvedPath.startsWith(projectRoot)) {
    return res.status(403).json({ error: "Access denied" });
  }

  await fs.writeFile(resolvedPath, content, "utf-8");
  return res.json({ success: true });
}

/**
 * POST /projects/:projectId/files
 * Body: { path: string }
 */
export async function createFile(
  req: Request,
  res: Response
) {
  const { projectId } = req.params;
  const { path: filePath } = req.body;
  const userId = req.user.id;

  const projectRoot = getProjectRoot(userId, projectId);
  const resolvedPath = path.resolve(projectRoot, "." + filePath);

  if (!resolvedPath.startsWith(projectRoot)) {
    return res.status(403).json({ error: "Access denied" });
  }

  await fs.writeFile(resolvedPath, "", "utf-8");
  return res.json({ success: true });
}

/**
 * POST /projects/:projectId/folders
 * Body: { path: string }
 */
export async function createFolder(
  req: Request,
  res: Response
) {
  const { projectId } = req.params;
  const { path: folderPath } = req.body;
  const userId = req.user.id;

  const projectRoot = getProjectRoot(userId, projectId);
  const resolvedPath = path.resolve(projectRoot, "." + folderPath);

  if (!resolvedPath.startsWith(projectRoot)) {
    return res.status(403).json({ error: "Access denied" });
  }

  await fs.mkdir(resolvedPath, { recursive: true });
  return res.json({ success: true });
}


/**
 * DELETE /projects/:projectId/files
 * Body: { path: string }
 */
export async function deleteEntry(
  req: Request,
  res: Response
) {
  const { projectId } = req.params;
  const { path: targetPath } = req.body;
  const userId = req.user.id;

  const projectRoot = getProjectRoot(userId, projectId);
  const resolvedPath = path.resolve(projectRoot, "." + targetPath);

  if (!resolvedPath.startsWith(projectRoot)) {
    return res.status(403).json({ error: "Access denied" });
  }

  const stat = await fs.stat(resolvedPath);

  if (stat.isDirectory()) {
    await fs.rm(resolvedPath, { recursive: true, force: true });
  } else {
    await fs.unlink(resolvedPath);
  }

  return res.json({ success: true });
}

/**
 * PUT /projects/:projectId/files/rename
 * Body: { oldPath: string, newPath: string }
 */
export async function renameEntry(
  req: Request,
  res: Response
) {
  const { projectId } = req.params;
  const { oldPath, newPath } = req.body;
  const userId = req.user.id;

  const projectRoot = getProjectRoot(userId, projectId);

  const resolvedOld = path.resolve(projectRoot, "." + oldPath);
  const resolvedNew = path.resolve(projectRoot, "." + newPath);

  if (
    !resolvedOld.startsWith(projectRoot) ||
    !resolvedNew.startsWith(projectRoot)
  ) {
    return res.status(403).json({ error: "Access denied" });
  }

  await fs.mkdir(path.dirname(resolvedNew), { recursive: true });
  await fs.rename(resolvedOld, resolvedNew);

  return res.json({ success: true });
}
