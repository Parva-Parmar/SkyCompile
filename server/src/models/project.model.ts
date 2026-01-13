import { pool } from "./db";

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

  return result.rows[0];
};


export const deleteProjectById = async (
  userId: string,
  projectId: string
) => {
  await pool.query(
    `
    DELETE FROM projects
    WHERE id = $1 AND owner_id = $2
    `,
    [projectId, userId]
  );
};
