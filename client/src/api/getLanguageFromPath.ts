// utils/getLanguageFromPath.ts
export function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "jsx":
      return "javascript";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "md":
      return "markdown";
    case "py":
      return "python";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "sh":
      return "shell";
    default:
      return "plaintext";
  }
}
