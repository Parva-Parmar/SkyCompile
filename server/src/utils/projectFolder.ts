import fs from "fs";
import path from "path";

const BASE_PROJECTS_DIR = path.join(
  process.cwd(),
  "skycompiler_projects"
);

export function createUserProjectFolder(userId: string) {
  if (!fs.existsSync(BASE_PROJECTS_DIR)) {
    fs.mkdirSync(BASE_PROJECTS_DIR);
  }

  const userDir = path.join(BASE_PROJECTS_DIR, userId);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }
}

export function createProjectFolder(
  userId: string,
  projectId: string
) {
  const projectDir = path.join(
    BASE_PROJECTS_DIR,
    userId,
    projectId
  );

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
}

export function deleteProjectFolder(
  userId: string,
  projectId: string
) {
  const projectDir = path.join(
    BASE_PROJECTS_DIR,
    userId,
    projectId
  );

  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
}