import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../db/pool.js";

const router = Router();

// TEMP user id (until auth is implemented)
const DEV_USER_ID = "11111111-1111-1111-1111-111111111111";

/**
 * POST /api/projects
 */
router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Project name is required" });
  }

  try {
    const id = uuidv4();

    const result = await pool.query(
      `
      INSERT INTO projects (id, user_id, name)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [id, DEV_USER_ID, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

/**
 * GET /api/projects
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM projects
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [DEV_USER_ID]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("List projects error:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project by ID (only if it belongs to the user)
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  try {
    const result = await pool.query(
      `
      DELETE FROM projects
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, DEV_USER_ID]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Project not found or not owned by user",
      });
    }

    res.json({
      message: "Project deleted successfully",
      project: result.rows[0],
    });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
