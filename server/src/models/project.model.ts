import { pool } from "./db";

export const getProjectsByUser = async (userId: string) => {
  const result = await pool.query(
    "SELECT id, name, created_at FROM projects WHERE owner_id = $1",
    [userId]
  );
  return result.rows;
};

export const insertProject = async (userId: string, name: string) => {
  await pool.query(
    "INSERT INTO projects (owner_id, name) VALUES ($1, $2)",
    [userId, name]
  );
};

export const deleteProjectById = async (
  userId: string,
  projectId: number
) => {
  await pool.query(
    "DELETE FROM projects WHERE id = $1 AND owner_id = $2",
    [projectId, userId]
  );
};
