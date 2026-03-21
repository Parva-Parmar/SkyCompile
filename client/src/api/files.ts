const API_BASE_URL = "http://localhost:8082/api/v1";

const getToken = () => localStorage.getItem("token");

import type { FileNode } from "../types/file";

// Get file tree
export const getFileTree = async (projectId: string) => {
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/files`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch file tree");
  }

  return res.json() as Promise<FileNode[]>;
};

// Get file content
export const getFileContent = async (
  projectId: string,
  path: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/files/content?path=${encodeURIComponent(
      path
    )}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch file content");
  }

  const data = await res.json();
  return data.content as string;
};

// Save file content
export const saveFileContent = async (
  projectId: string,
  path: string,
  content: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/files/content`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ path, content }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save file");
  }
};

// Create file
export const createFile = async (
  projectId: string,
  path: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/files`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ path }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create file");
  }
};

// Create folder
export const createFolder = async (
  projectId: string,
  path: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/folders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ path }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create folder");
  }
};

// Delete file or folder
export const deleteEntry = async (
  projectId: string,
  path: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/files`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ path }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete entry");
  }
};

// Rename file or folder
export const renameEntry = async (
  projectId: string,
  oldPath: string,
  newPath: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/projects/${projectId}/files/rename`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ oldPath, newPath }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to rename entry");
  }
};

