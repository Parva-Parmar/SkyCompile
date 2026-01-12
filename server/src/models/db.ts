import { Pool } from "pg";

if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD is missing. Check .env loading order.");
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // now guaranteed string
  database: process.env.DB_NAME,
});
