import fs from "fs";
import path from "path";

/**
 * Base directory where all user projects are stored.
 * Example:
 * skycompiler_projects/
 *   └── userId/
 *         └── projectId/
 */
const BASE_PROJECTS_DIR = path.join(
  process.cwd(),
  "skycompiler_projects"
);

/**
 * Ensures the base projects directory exists.
 */
function ensureBaseDirectory() {
  if (!fs.existsSync(BASE_PROJECTS_DIR)) {
    fs.mkdirSync(BASE_PROJECTS_DIR, { recursive: true });
  }
}

/**
 * Creates a folder for a specific user.
 * @param userId - string or number (DB SERIAL or UUID)
 */
export function createUserProjectFolder(userId: string | number) {
  ensureBaseDirectory();

  const userDir = path.join(BASE_PROJECTS_DIR, String(userId));

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
}

/**
 * Creates a folder for a specific project under a user.
 * @param userId - string or number
 * @param projectId - string or number
 */
export function createProjectFolder(
  userId: string | number,
  projectId: string | number
) {
  ensureBaseDirectory();

  const projectDir = path.join(
    BASE_PROJECTS_DIR,
    String(userId),
    String(projectId)
  );

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
}

/**
 * Deletes a specific project folder.
 * @param userId - string or number
 * @param projectId - string or number
 */
export function deleteProjectFolder(
  userId: string | number,
  projectId: string | number
) {
  const projectDir = path.join(
    BASE_PROJECTS_DIR,
    String(userId),
    String(projectId)
  );

  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
}
