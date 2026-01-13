import { pool } from "./db";
import {
  createProjectFolder,
  deleteProjectFolder
} from "../utils/projectFolder";

export const getProjectsByUser = async (userId: string) => {
  const result = await pool.query(
    "SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

export const insertProject = async (userId: string, name: string) => {
  const result = await pool.query(
    `
    INSERT INTO projects (owner_id, name)
    VALUES ($1, $2)
    RETURNING *
    `,
    [userId, name]
  );

  const project = result.rows[0];
  createProjectFolder(userId, project.id);

  return project;
};


export const deleteProjectById = async (
  userId: string,
  projectId: string
) => {
  const result = await pool.query(
    `
    DELETE FROM projects
    WHERE id = $1 AND owner_id = $2
    RETURNING id
    `,
    [projectId, userId]
  );

 
  if (result.rowCount && result.rowCount > 0) {
    deleteProjectFolder(userId, projectId);
  }
};
