import path from "path";

export function getProjectRoot(userId: string, projectId: string): string {
  return path.join(
    process.cwd(),
    "skycompiler_projects",
    userId,
    projectId
  );
}
