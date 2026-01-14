import fs from "fs/promises";
import path from "path";

export type FileTreeNode = {
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
};

/**
 * Recursively builds a file tree starting from a directory
 */
export async function buildFileTree(
  dir: string
): Promise<FileTreeNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const tree: FileTreeNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      tree.push({
        name: entry.name,
        type: "folder",
        children: await buildFileTree(fullPath),
      });
    } else {
      tree.push({
        name: entry.name,
        type: "file",
      });
    }
  }

  return tree;
}
