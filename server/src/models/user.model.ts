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