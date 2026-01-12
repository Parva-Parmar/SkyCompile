import { pool } from "./db";
import { User } from "../types/user.type";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0] || null;
};

export const createUser = async (user: Omit<User, "id">) => {
  await pool.query(
    `
    INSERT INTO users (id, firstname, lastname, email, password)
    VALUES (gen_random_uuid(), $1, $2, $3, $4)
    `,
    [user.firstname, user.lastname, user.email, user.password]
  );
};

export const getProfileByUserId = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT
      u.firstname,
      u.lastname,
      u.email,
      COUNT(DISTINCT p.id) AS project_count,
      COUNT(DISTINCT f.friend_id) AS friend_count
    FROM users u
    LEFT JOIN projects p ON p.owner_id = u.id
    LEFT JOIN friendships f ON f.user_id = u.id
    WHERE u.id = $1
    GROUP BY u.id
    `,
    [userId]
  );

  return result.rows[0];
};
