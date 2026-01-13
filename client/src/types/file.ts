export type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};
